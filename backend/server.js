/**
 * server.js
 *
 * Local compiler API for C++, Java, Python, Node.js.
 * - Job queue with concurrency limit
 * - Per-job timeout and output size limit
 * - Per-IP rate limiting
 * - Optional use of firejail on Linux (if installed) for sandboxing
 *
 * NOTE: This reduces risk but does NOT replace a proper sandbox.
 */

const express = require("express");
const bodyParser = require("body-parser");
const { spawn, execSync } = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const rateLimit = require("express-rate-limit");
const os = require("os");
const cors = require("cors");

const exeDir = path.dirname(process.execPath);
const compilerEnvPath = path.join(exeDir, "..", "compiler_env");
const tRoot = path.join(os.tmpdir(), "compiler_temp");
fs.ensureDirSync(tRoot);
// === CONFIG ===
const CONFIG = {
  port: 3000,
  tmpRoot: tRoot, // make sure this is writable
  maxConcurrent: 4, // how many compile/execution jobs run in parallel
  perJobTimeoutMs: 8000, // kill job after this ms
  maxStdoutBytes: 200 * 1024, // 200 KB
  perIpWindowMs: 60 * 1000, // 1 minute window
  perIpMaxRequests: 60, // max requests per IP per window
  useFirejailIfAvailable: true, // will prefix commands with firejail --quiet --private if found (Linux only)
  compilers:  {
  cpp: { 
    exe: path.join(compilerEnvPath, "cpp", "bin", os.platform() === "win32" ? "g++.exe" : "g++"), 
    runBinarySuffix: os.platform() === "win32" ? ".exe" : "" 
  },
  java: { 
    javac: path.join(compilerEnvPath, "java", "bin", os.platform() === "win32" ? "javac.exe" : "javac"), 
    java: path.join(compilerEnvPath, "java", "bin", os.platform() === "win32" ? "java.exe" : "java") 
  },
  python: { 
    exe: path.join(compilerEnvPath, "python", "bin", os.platform() === "win32" ? "python.exe" : "python") 
  },
  node: { 
    exe: path.join(compilerEnvPath, "node", "bin", os.platform() === "win32" ? "node.exe" : "node") 
  }
}
};
// ==============

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "1mb" }));

// Rate limiter - basic per-IP protection
const limiter = rateLimit({
  windowMs: CONFIG.perIpWindowMs,
  max: CONFIG.perIpMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ error: "Too many requests, slow down." });
  }
});
app.use(limiter);

// Ensure tmp root exists
fs.ensureDirSync(CONFIG.tmpRoot);

// FIFO queue + worker pool
class JobQueue {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }
  push(job) {
    this.queue.push(job);
    this._next();
  }
  _next() {
    if (this.running >= this.concurrency) return;
    const job = this.queue.shift();
    if (!job) return;
    this.running++;
    job()
      .catch(() => {}) // job handles its own errors
      .finally(() => {
        this.running--;
        this._next();
      });
  }
}
const queue = new JobQueue(CONFIG.maxConcurrent);

// firejail detection (Linux)
let firejailAvailable = false;
if (CONFIG.useFirejailIfAvailable && os.platform() === "linux") {
  try {
    execSync("which firejail", { stdio: "ignore" });
    firejailAvailable = true;
    console.log("firejail detected: will try to use it for sandboxing.");
  } catch (e) {
    console.log("firejail not found; running without firejail sandbox.");
  }
}

// runCommandWithTimeout now accepts stdinData (string) and writes to proc.stdin
async function runCommandWithTimeout(cmd, args, opts = {}, timeoutMs = 5000, stdinData = "") {
  return new Promise((resolve) => {
    let proc;
    try {
      proc = spawn(cmd, args, opts);
    } catch (err) {
      return resolve({ code: null, signal: null, timedOut: false, stdout: "", stderr: err.message });
    }

    // send stdin if provided
    if (stdinData && proc.stdin) {
      try {
        proc.stdin.write(stdinData);
      } catch (e) {}
      try { proc.stdin.end(); } catch (e) {}
    }

    let timedOut = false;
    const to = setTimeout(() => {
      timedOut = true;
      try { proc.kill("SIGKILL"); } catch (e) {}
    }, timeoutMs);

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (d) => {
      stdout += d.toString();
      if (stdout.length > CONFIG.maxStdoutBytes) {
        stdout = stdout.slice(0, CONFIG.maxStdoutBytes);
        try { proc.kill("SIGKILL"); } catch (e) {}
      }
    });
    proc.stderr.on("data", (d) => {
      stderr += d.toString();
      if (stderr.length > CONFIG.maxStdoutBytes) {
        stderr = stderr.slice(0, CONFIG.maxStdoutBytes);
        try { proc.kill("SIGKILL"); } catch (e) {}
      }
    });

    proc.on("close", (code, signal) => {
      clearTimeout(to);
      resolve({ code, signal, timedOut, stdout, stderr });
    });
    proc.on("error", (err) => {
      clearTimeout(to);
      resolve({ code: null, signal: null, timedOut, stdout, stderr: err.message });
    });
  });
}

// Main compile/run handler (uses runCommandWithTimeout with stdin)
async function handleJob(language, code, stdin, jobTmpDir) {
  const safeFile = (name, contents) => fs.writeFileSync(path.join(jobTmpDir, name), contents, { encoding: "utf8" });

  // normalize stdin to string (ensure newline if user expects)
  const stdinData = (typeof stdin === "string") ? stdin : "";
  // do not auto-add newline; let caller specify "5\n"
  console.log(`Handling job in ${language}, tmpDir: ${jobTmpDir}`);
  if (language === "cpp") {
    const src = "main.cpp";
    safeFile(src, code);
    const outBinName = "main" + CONFIG.compilers.cpp.runBinarySuffix;
    const outBinPath = path.join(jobTmpDir, outBinName);
    const gpp = CONFIG.compilers.cpp.exe;
    console.log("Using g++ at:", gpp);

    const compileArgs = [path.join(jobTmpDir, src), "-O2", "-std=c++17", "-o", outBinPath];
    const compileCmd = firejailAvailable ? "firejail" : gpp;
    const compileArgsFinal = firejailAvailable ? ["--quiet", "--private=" + jobTmpDir, "--", gpp].concat(compileArgs.slice(1)) : compileArgs;

    const compileRes = await runCommandWithTimeout(compileCmd, compileArgsFinal, { cwd: jobTmpDir }, CONFIG.perJobTimeoutMs);
    if (compileRes.timedOut) return { error: "Compilation timed out" };
    if (compileRes.code !== 0) 
      {
          console.log({ stdout: compileRes.stdout, stderr: compileRes.stderr, exitCode: compileRes.code })
          return { stderr: compileRes.stderr || compileRes.stdout || "Compilation error" };
      } 

    if (!firejailAvailable) {
      // spawn the binary directly and pass stdinData
      const runRes = await runCommandWithTimeout(outBinPath, [], { cwd: jobTmpDir, shell: false }, CONFIG.perJobTimeoutMs, stdinData);
      if (runRes.timedOut) return { error: "Execution timed out" };
      console.log("❌ Compilation failed!");
      console.log({ stdout: runRes.stdout, stderr: runRes.stderr, exitCode: runRes.code });
      return { stdout: runRes.stdout, stderr: runRes.stderr, exitCode: runRes.code };
    } else {
      // run via firejail wrapper
      const argsForFirejail = ["--quiet", "--private=" + jobTmpDir, "--", outBinPath];
      const runRes = await runCommandWithTimeout("firejail", argsForFirejail, { cwd: jobTmpDir }, CONFIG.perJobTimeoutMs, stdinData);
      if (runRes.timedOut) return { error: "Execution timed out" };
      console.log("❌ Compilation failed!");
      console.log({ stdout: runRes.stdout, stderr: runRes.stderr, exitCode: runRes.code });

      return { stdout: runRes.stdout, stderr: runRes.stderr, exitCode: runRes.code };
    }

  } else if (language === "java") {
    const src = "Main.java";
    safeFile(src, code);
    const javac = CONFIG.compilers.java.javac;
    const javaCmd = CONFIG.compilers.java.java;
    console.log("Using g++ at:", javac);
    const compileRes = await runCommandWithTimeout(javac, [path.join(jobTmpDir, src)], { cwd: jobTmpDir }, CONFIG.perJobTimeoutMs);
    if (compileRes.timedOut) return { error: "Compilation timed out" };
    if (compileRes.code !== 0) return { stderr: compileRes.stderr || compileRes.stdout || "Compilation error" };

    const runRes = await runCommandWithTimeout(javaCmd, ["-cp", jobTmpDir, "Main"], { cwd: jobTmpDir }, CONFIG.perJobTimeoutMs, stdinData);
    if (runRes.timedOut) return { error: "Execution timed out" };
    return { stdout: runRes.stdout, stderr: runRes.stderr, exitCode: runRes.code };

  } else if (language === "python") {
    const src = "main.py";
    safeFile(src, code);
    const py = CONFIG.compilers.python.exe;

    const runRes = await runCommandWithTimeout(py, [path.join(jobTmpDir, src)], { cwd: jobTmpDir }, CONFIG.perJobTimeoutMs, stdinData);
    if (runRes.timedOut) return { error: "Execution timed out" };
    return { stdout: runRes.stdout, stderr: runRes.stderr, exitCode: runRes.code };

  } else if (language === "node") {
    const src = "main.js";
    safeFile(src, code);
    const nodeexe = CONFIG.compilers.node.exe;

    const runRes = await runCommandWithTimeout(nodeexe, [path.join(jobTmpDir, src)], { cwd: jobTmpDir }, CONFIG.perJobTimeoutMs, stdinData);
    if (runRes.timedOut) return { error: "Execution timed out" };
    return { stdout: runRes.stdout, stderr: runRes.stderr, exitCode: runRes.code };
  } else {
    return { error: "Unsupported language" };
  }
}

// Endpoint
app.post("/run", async (req, res) => {
  try {
    const { language, code, stdin } = req.body || {};
    if (!language || !code) return res.status(400).json({ error: "language and code are required" });
    const lang = language.toLowerCase();
    if (!["cpp", "java", "python", "node"].includes(lang)) return res.status(400).json({ error: "unsupported language" });

    // Build job
    const jobId = uuidv4();
    const jobTmpDir = path.join(CONFIG.tmpRoot, jobId);
    await fs.ensureDir(jobTmpDir);

    const jobPromise = new Promise((resolve) => {
      queue.push(async () => {
        let result;
        try {
          result = await handleJob(lang, code, stdin || "", jobTmpDir);
        } catch (err) {
          result = { error: "Internal server error: " + (err && err.message) };
        } finally {
          // cleanup
          try { await fs.remove(jobTmpDir); } catch (e) {}
          resolve(result);
        }
      });
    });

    const result = await jobPromise;
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Health check
app.get("/", (req, res) => res.json({ status: "ok", concurrency: queue.running }));

app.listen(CONFIG.port, "0.0.0.0", () => {
  console.log(`Local Compiler API listening on port ${CONFIG.port}`);
  console.log(`Temp root: ${CONFIG.tmpRoot}`);
});
