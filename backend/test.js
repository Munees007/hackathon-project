// test.js
const axios = require("axios");

const testData = {
  cpp: {
    withoutInput: `#include <iostream>
using namespace std;
int main() {
    cout << "Hello from C++!"
    return 0;
}`,
    withInput: `#include <iostream>
using namespace std;
int main() {
    int num;
    cin >> num;
    cout << num * num;
    return 0;
}`,
    stdin: "5"
  },
  java: {
    withoutInput: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
    }
}`,
    withInput: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int num = sc.nextInt();
        System.out.println(num * num);
    }
}`,
    stdin: "5"
  },
  python: {
    withoutInput: `print("Hello from Python!")`,
    withInput: `num = int(input())
print(num * num)`,
    stdin: "5"
  },
  node: {
    withoutInput: `console.log("Hello from Node.js!");`,
    withInput: `process.stdin.on("data", (data) => {
    const num = parseInt(data.toString().trim(), 10);
    console.log(num * num);
});`,
    stdin: "5"
  }
};

async function runTests() {
  for (const [lang, data] of Object.entries(testData)) {
    console.log(`\n=== Testing ${lang.toUpperCase()} (without input) ===`);
    await sendCode(lang, data.withoutInput, "");

    console.log(`\n=== Testing ${lang.toUpperCase()} (with input) ===`);
    await sendCode(lang, data.withInput, data.stdin);
  }
}

async function sendCode(language, code, stdin) {
  try {
    const response = await axios.post("http://localhost:3000/run", {
      language,
      code,
      stdin
    });
    console.log("Output:", response.data.output || response.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}

runTests();
