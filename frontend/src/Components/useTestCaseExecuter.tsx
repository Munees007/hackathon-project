import { useRef } from "react";
import { testCase, Level, testCaseResult } from "../types/QuestionType";
import { executeCode } from "../Database/executeCode";


export const useTestCaseExecutor = () => {
  const iFrameRef = useRef<HTMLIFrameElement>(null);
  
  function parseOutput(rawOutput:string) {
  const startMarker = "===result_start===";
  const endMarker = "===result_end===";

  let [before, after] = rawOutput.split(startMarker);
  if (!after) return { debug: rawOutput, result: "" }; // no result markers found

  let [result, remaining] = after.split(endMarker);

  return {
    debug: (before + (remaining || "")).trim(), // user's debug statements
    result: result.trim(), // final result
  };
}


  const ExecuteTestCases = async (
    currentLevelData: Level,
    questionNo: number,
    Code: string,
    languageCode: number
  ): Promise<testCaseResult | void> => {
    const testCases: testCase[] = currentLevelData.questions[questionNo - 1].content.testCase;

    let Result: testCaseResult = {
      sucess: false,
      output: "",
      testCaseFailed: 0,
      testCaseSucceded: 0,
    };

    if (!testCases || testCases.length === 0) return;

  //   const languages = [
  //   { label: "Cpp", value: 54,mode:"c_ccp",lang:"cpp" },
  //   { label: "Java", value: 62,mode:"java",lang:"java" },
  //   { label: "Python", value: 71,mode:"python",lang:"python" },
  // ];
  // const language = languages.find((l)=> l.value === languageCode)?.lang
    for (let i = 0; i < testCases.length; i++) {
      const finalCode: string =
        currentLevelData.questions[questionNo - 1].content.boilerCode?.find((b)=> b.languageCode == languageCode)?.boilerCodeTop +
        Code +
        currentLevelData.questions[questionNo - 1].content.boilerCode?.find((b)=> b.languageCode == languageCode)?.boilerCodeBottom;

      // ExecuteCode(finalCode, language!, `main.${language}`, testCases[i].input);
      // const result = await TriggerRun();
      const result = await executeCode(finalCode, languageCode,  testCases[i].input);
      let parsed = parseOutput(result.output);
      console.log(result)
      console.log(parsed)
      testCases[i].producedOutput = parsed.result;
      testCases[i].stdOutput = parsed.debug;
      if (result.success && parsed.result.trim() === testCases[i].output.trim()) {
        Result.sucess = true;
        Result.testCaseSucceded++;
        testCases[i].isCorrect = true;
      } else {
        testCases[i].isCorrect = false;
        Result.testCaseFailed++;
        Result.sucess = false;
      }
    }
    Result.testCase = testCases;
    return Result;
  };

  return { ExecuteTestCases, iFrameRef };
};
