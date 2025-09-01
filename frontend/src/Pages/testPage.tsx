import  { useState } from "react";
import { useTestCaseExecutor } from "../Components/useTestCaseExecuter"; // adjust path
import { Level } from "../types/QuestionType";
import { TestCase } from "../Components/TestCase";
import axios from "axios";
import RulesCard from "../Components/RulesCard";

const TestPage = () => {
  const [result, setResult] = useState<any>(null);
  const { ExecuteTestCases } = useTestCaseExecutor();

  const levelData: Level ={ questions:[
    {title:"Armstrong Number",
        content:{
  problem: "Check if a given number is an Armstrong number.",
  input: "An integer number.",
  output: "Return 'Yes' if the number is an Armstrong number, otherwise return 'No'.",
  example1: {
    input: "153",
    output: "Yes",
  },
  example2: {
    input: "123",
    output: "No",
  },
  testCase: [
    {
      input: "153",
      output: "Armstrong Number",
    },
    {
      input: "370",
      output: "Armstrong Number",
    },
    {
      input: "371",
      output: "Armstrong Number",
    },
    {
      input: "123",
      output: "Not an Armstrong number",
    },
    {
        input: "9474",
        output: "Armstrong Number",
    },
    {
        input: "9475",
        output: "Not an Armstrong number",
    }
  ],
  boilerCode:[
    {
      boilerCodeTop: `#include <iostream>\n#include <cmath>\nusing namespace std;\n\n`,
      boilerCodeBottom: `
int main() {
    int num;
    cin >> num;

    
    bool result = isArmstrong(num);
    cout << "===result_start===" << endl;
    cout << (result ? "Armstrong Number" : "Not an Armstrong number") << endl;
    cout << "===result_end===" << endl;

    return 0;
}`,

      funtionSignature: "bool isArmstrong(int num)",
      languageCode: 54 // C++
    },
    {
      boilerCodeTop: `import java.util.Scanner;\n\n`,
      boilerCodeBottom: `\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int num = sc.nextInt();\n        System.out.println(isArmstrong(num) ? "Armstrong Number" : "Not an Armstrong number");\n    }\n}`,
      funtionSignature: "static boolean isArmstrong(int num)",
      languageCode: 62 // Java
    },
    {
      boilerCodeTop: `def is_armstrong(num):\n    original = num\n    sum = 0\n    digits = len(str(num))\n\n`,
      boilerCodeBottom: `\n\nnum = int(input())\nprint("Armstrong Number" if is_armstrong(num) else "Not an Armstrong number")`,
      funtionSignature: "def is_armstrong(num)",
      languageCode: 71 // Python
    }
  ]
  
}}]};



  const handleCheck = async () => {
    const temp = await axios.get("http://localhost:3000/");
    console.log(temp.data);
    const res = await ExecuteTestCases(levelData, 1, `bool isArmstrong(int num) {
    int original = num, sum = 0;
    int digits = to_string(num).length();
    cout <<"Digits = "<<digits << endl;
    cout<< "Given Number = "<<num<<endl;
    while (num > 0) {
        int digit = num % 10;
        sum += pow(digit, digits);
        num /= 10;
    }

    return sum == original;
}`,54);
    setResult(res);
  };

  return (
    <div>
    <button onClick={handleCheck}>Clcik</button>
      <TestCase caseResult={result}></TestCase>
      <RulesCard/>
    </div>
  );
};

export default TestPage;