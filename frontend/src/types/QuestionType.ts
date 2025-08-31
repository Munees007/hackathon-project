import { FormData } from "../Components/Form"

//question type
type example = {
    input:string,
    output:string
  }

export type testCaseResult = {
  sucess:boolean,
  testCaseFailed:number,
  output:string,
  testCaseSucceded:number,
  testCase?:testCase[]
}
export type testCase = {
  input:string,
  output:string,
  stdOutput?:string,
  producedOutput?:string,
  isCorrect?:boolean
  testCaseNo?:number
}
type BoilerCode = {
  boilerCodeTop?:string,
  boilerCodeBottom?:string,
  funtionSignature?:string,
  languageCode?:number
}
type content = {
      problem:string,
      input: string,
      output:string,
      example1:example,
      example2:example,
      testCase:testCase[],
      boilerCode?:BoilerCode[],
  }
export type questionType = {
    title: string,
    content: content,
    
}
export type Level = {
    questions:questionType[],
    levelIndex?:number
}
//answer type individual users
export type answerFormat = {
  language:string,
  code:string,
  answered:boolean,
  testCaseResult:testCaseResult,
  questionNo:number,
  levelIndex:number,
}
export type answerLevel = {
  answer:answerFormat[],
  score?:number
}
export type answerType = {
  finalAnswer:answerLevel[],
  timeLeft ?: number
}

export type FeedbackType = {
  user: FormData; // from your existing Admin.ts type
  aboutWebsite: string;
  aboutOrganization: string;
  whatYouLiked: string;
  improvements: string;
  additionalComments: string;
  createdAt: number; // timestamp
};
