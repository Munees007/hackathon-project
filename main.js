import { fork, spawn } from "child_process";
import { app, BrowserWindow, globalShortcut } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import Logger from "electron-log";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


let backendProcess;
function createWindow() {

  
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (app.isPackaged) {
    Logger.info("App is packaged");
    Logger.info("execPath = ",process.execPath);
    Logger.info("resPath = ",process.resourcesPath);
    Logger.info("dir = ",__dirname);
    const backendPath = path.join(process.resourcesPath, 'backend', 'CodeRunner.exe');
    backendProcess = spawn(backendPath, [], {stdio:"pipe"});
    mainWindow.loadURL(
      `file://${path.join(process.resourcesPath, "frontend/dist/index.html")}`
    );
  
    
  } else {
    const backendPath = path.join(__dirname, 'backend', 'CodeRunner.exe');
    backendProcess = spawn(backendPath, [], {stdio:"pipe"});
    mainWindow.loadURL("http://localhost:5173");
  }

  globalShortcut.register("F12",()=>{
    mainWindow.webContents.openDevTools();
  })
  

}

app.whenReady().then(createWindow);

app.on('will-quit', () => {
  if (backendProcess) backendProcess.kill();
});