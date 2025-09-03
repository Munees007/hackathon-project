import React, { useEffect, useState } from "react";
import { testCase, testCaseResult } from "../types/QuestionType";

interface DisplayTestCaseProps
{
  caseResult?:testCaseResult | testCase[],
}
export const DisplayTestCase:React.FC<DisplayTestCaseProps> = ({ caseResult }) => {
  const [testCases, setTestCases] = useState<testCase[]>([]);
  const [CurrentTestCase, SetCurrentTestCase] = useState<testCase>();
  const [onlyTestCase,setOnlyTestCase] = useState<boolean>(false);
  useEffect(() => {
    if ("sucess" in (caseResult ?? {})) {
      const temp:testCaseResult = caseResult as testCaseResult
      setTestCases(temp.testCase!);
    }
    else
    {
      setOnlyTestCase(true);
      setTestCases(caseResult as testCase[])
    }
  }, [caseResult]);
  return (
    <div className="m-3 w-fit">
  {/* Test Case Buttons Row */}
  <div className="flex flex-wrap" id="test-case-row">
    {testCases?.map((testCase, index) => {
      const isCorrect = testCase.isCorrect || onlyTestCase;
      const buttonColor = isCorrect
        ? {
            text: "text-green-400",
            border: "border-green-500",
            hover: "hover:bg-green-100",
            ping: "bg-green-500",
            selected: "bg-green-200",
          }
        : {
            text: "text-red-400",
            border: "border-red-500",
            hover: "hover:bg-red-100",
            ping: "bg-red-500",
            selected: "bg-red-200",
          };

      return (
        <div key={index} className="relative m-2">
          {/* Ping Animation */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${buttonColor.ping} opacity-75`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${buttonColor.ping}`}
            ></span>
          </span>

          {/* Button */}
          <button
            className={`px-4 py-2 border rounded-xl font-semibold ${CurrentTestCase === testCase ? buttonColor.selected : ""} ${buttonColor.text} ${buttonColor.border} ${buttonColor.hover}`}
            onClick={() => {
                if (CurrentTestCase === testCase) {
                  SetCurrentTestCase(undefined); // Deselect if already selected
                  return;
                }
                testCase.testCaseNo = index+1;
                SetCurrentTestCase(testCase);
                console.log(testCase)
            }}
          >
            Test Case {index + 1}
          </button>
        </div>
      );
    })}
  </div>

  {/* Test Case Card */}
  {CurrentTestCase && (
    <div className="mt-4 w-full">
      <div
        key={CurrentTestCase.testCaseNo} // Re-renders the content on each selection
        className={`w-full border rounded-xl shadow-md p-0  transition-all duration-300 ${
          CurrentTestCase.isCorrect
            ? "border-green-400 bg-green-50"
            : "border-red-400 bg-red-50"
        }`}
      >
        {/* Animated inner content */}
        <div className="animate-zoom-in px-6 py-4">
          <h3
            className={`text-xl font-bold mb-3 ${
              CurrentTestCase.isCorrect ? "text-green-700" : "text-red-700"
            }`}
          >
            ✅ Test Case {CurrentTestCase.testCaseNo}
          </h3>

          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong className="text-gray-800">Input:</strong>{" "}
              <code className="bg-gray-200 px-1 py-0.5 rounded">
                {CurrentTestCase.input}
              </code>
            </p>

            <p>
              <strong className="text-gray-800">Expected Output:</strong>{" "}
              <code className="bg-gray-200 px-1 py-0.5 rounded">
                {CurrentTestCase.output}
              </code>
            </p>

            {CurrentTestCase.stdOutput && (
              <p>
                <strong className="text-gray-800">Std Output:</strong>
                <br></br>
                <div className="w-full rounded-md bg-gray-200">
                <code className=" px-1 py-0.5 rounded whitespace-pre-wrap">
                  {CurrentTestCase.stdOutput}
                </code>
                </div>
              </p>
            )}

            {CurrentTestCase.producedOutput && (
              <p>
                <strong className="text-gray-800">Produced Output:</strong>{" "}
                <code className="bg-gray-200 px-1 py-0.5 rounded">
                  {CurrentTestCase.producedOutput}
                </code>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )}
</div>

  );
};
