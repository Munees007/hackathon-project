import { useEffect, useState } from "react";
import { CodeSnippet } from "../Components/BrainSpark/CodeSnippet";
import { QuestionItem } from "../types/BrainSparkType";
import { getQuestions } from "../Database/brainspark";
import { RiddleLogic } from "../Components/BrainSpark/RiddleLogic";
import { AlgorithmDrag } from "../Components/BrainSpark/AlgorithmDrag";
import { toast } from "react-toastify";

export const BrainSpark = () => {
  const [questions,setQuestions] = useState<QuestionItem[]>([])
  const [index,setIndex] = useState<number>(0)

  const [currentQuestion,setCurrentQuestion] = useState<QuestionItem | null>(null);
  useEffect(()=>{
    const fetch = async () =>{
      const temp:QuestionItem[] = await getQuestions();
      setQuestions(temp);

      setCurrentQuestion(temp[index])
    }
    fetch()
    
  },[])

  const changeQuestion = async (isCorrect:boolean) =>{
    toast.info(isCorrect ? "Correct" : "inCorrect")
    setIndex(prev => {
      setCurrentQuestion(questions[prev + 1])
      return prev + 1
    })
  }
  return (
    <div className="min-h-screen w-full bg-[#020617] relative">
      <p className="font-[Orbitron] font-extrabold max-sm:relative max-sm:m-0 max-sm:ml-3 absolute top-0 m-2 text-2xl uppercase tracking-widest z-10 text-white">
        Brain Spark
      </p>
      {/* Magenta Orb Grid Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#020617",
          backgroundImage: `
        linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
        radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
      `,
          backgroundSize: "40px 40px, 40px 40px, 100% 100%",
        }}
      />
      {/* Your Content/Components */}
      <div className="relative z-10 flex-col flex justify-center items-center h-screen max-sm:h-full">

          {
            currentQuestion && (
            currentQuestion!.type == "code_snip" ? 
              <CodeSnippet code={{
                code:currentQuestion?.question ?? "",
                options:currentQuestion?.options ?? [],
                answer:currentQuestion?.answer,
                output:currentQuestion?.output
              }} changeQuestion={changeQuestion}/> : 
            currentQuestion!.type == "logic_riddle" ?
              <RiddleLogic riddle={{question:currentQuestion.question ?? "",options:currentQuestion.options ?? [],answer:currentQuestion.answer}} changeQuestion={changeQuestion}/> : 
              <AlgorithmDrag 
              algorithm={{
                algorithm:currentQuestion.algorithm ?? [],
                correctOrder:currentQuestion.correctOrder
              }} changeQuestion={changeQuestion}/>)
          }
      </div>

      <div className="absolute right-3 bottom-3"></div>
    </div>
  );
};
