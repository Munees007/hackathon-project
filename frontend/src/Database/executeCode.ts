import axios from "axios";
import { ResultType } from "../Components/Compiler";

export const executeCode = async (
  finalCode: string,
  languageCode: number,
  input: string
): Promise<ResultType> => {
  let result: ResultType = {
    success: false,
    output: "",
  };
const languages = [
    { label: "cpp", value: 54 },
    { label: "java", value: 62 },
    { label: "python", value: 71 },
  ];
  const language = languages.find(lang => lang.value === languageCode);
  console.log("Selected language:", language);
  console.log("Final Code", finalCode)
  console.log("Type of languageCode =", typeof languageCode, languageCode);

  try {
    const response = await axios.post(
      "http://localhost:3000/run",
      {
        language: language?.label || "cpp",
        code: finalCode,
        stdin: input,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );


    const data = response.data;
    console.log("Response data:", data);

    if (!data.stderr && !data.compile_output) {
    result.success = true;
    result.output = data.stdout || "";
  } else {
    result.success = false;
    result.output =
      data.stderr || data.compile_output || "Unknown error occurred";
  }
} catch (error: any) {
  result.success = false;
  result.output = error.message || "Request failed";
}
  
  return result;
};
