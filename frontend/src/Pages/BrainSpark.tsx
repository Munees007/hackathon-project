import { useEffect, useState } from "react";
import { CodeSnippet } from "../Components/BrainSpark/CodeSnippet";
import { QuestionItem } from "../types/BrainSparkType";
import { getQuestions, updateBrainSparkTime, updateScore } from "../Database/brainspark";
import { RiddleLogic } from "../Components/BrainSpark/RiddleLogic";
import { AlgorithmDrag } from "../Components/BrainSpark/AlgorithmDrag";
import { formatTime, updateBreak } from "../Components/Editor";
import { useNavigate } from "react-router-dom";

export const BrainSpark = () => {
  const bs_score = "bs_score";
  const navigate = useNavigate()
  const [score,setScore] = useState<number>(()=>{
    return parseInt(localStorage.getItem(bs_score) ?? "0")
  })
  const [questions,setQuestions] = useState<QuestionItem[]>(()=>{
    const data = localStorage.getItem("brain_spark_qns") || null
    if(data)
    {
      return JSON.parse(data)
    }
    return data
  })
  const [index,setIndex] = useState<number>(()=>{
    return parseInt(localStorage.getItem("bs_index") ?? "0")
  })
  const [currentQuestion,setCurrentQuestion] = useState<QuestionItem | null>();
  const [timer,setTimer] = useState<number>(()=>{
    return parseInt(localStorage.getItem("bs_Timer") || "0")
  })
  const [timerRunning,setTimerRunning] = useState<boolean>(true)
 function fisherYatesShuffle(arr:QuestionItem[]) {
  	for (let i = arr.length - 1; i > 0; i--) {
    	const j = Math.floor(Math.random() * (i + 1));
    	[arr[i], arr[j]] = [arr[j], arr[i]];
  	}
  	return arr;
}
  const brain_spark_key = "brain_spark_qns"
  const brain_spark_index = "bs_index"
  const timeRef = "dbTime"
  useEffect(()=>{
    if(localStorage.getItem("Round1") === "completed")
    {
      navigate("/codespace")
    } 
  },[navigate])
  const handleGameOver = async () =>{
    setTimerRunning(false)
    localStorage.setItem("Round1","completed")
    await updateBrainSparkTime(timer);
    await updateBreak(true)
    navigate("/codespace")
  }
  useEffect(() => {
  if (!timerRunning) return;

  const interval = setInterval(() => {
    setTimer((prev) => {
      if (prev <= 1) {
        handleGameOver();
        return 0; 
      }
      const newTime = prev - 1;
      localStorage.setItem("bs_Timer", newTime.toString());
      return newTime;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [timerRunning]);

  useEffect(()=>{
    const fetch = async () =>{
      const isDataNew = localStorage.getItem(brain_spark_key) || null
      if(isDataNew == null)
      {
        const temp:QuestionItem[] = await getQuestions();
        const shuffled = fisherYatesShuffle(temp)
        setQuestions(shuffled);
        setCurrentQuestion(shuffled[index])

        localStorage.setItem(brain_spark_key,JSON.stringify(shuffled))
        localStorage.setItem(brain_spark_index,index.toString())
        let round1Time = JSON.parse(localStorage.getItem(timeRef)|| "")
        setTimer(parseInt(round1Time.Round1Time))
        localStorage.setItem("bs_Timer",round1Time.Round1Time.toString())
      }
      else
      {
        const i = parseInt(localStorage.getItem(brain_spark_index) || "0")
        setIndex(i)
        setCurrentQuestion(questions[i])
      }
    }
    fetch()
    
  },[])

  const changeQuestion = async (isCorrect:boolean) =>{
    
    if(isCorrect)
    {
      localStorage.setItem(bs_score,(score+1).toString())
      await updateScore(score + 1)
      setScore(prev => prev + 1)
    }
    setIndex(prev => {
      localStorage.setItem(brain_spark_index, (prev+1).toString())
      setCurrentQuestion(questions[prev + 1])
      return prev + 1
    })

    if(index + 1 == questions.length)
    {
      handleGameOver()
    }
    
  }
  return (
    <div className="min-h-screen w-full bg-[#020617] relative">
      <p className="font-[Orbitron] font-extrabold max-sm:relative max-sm:m-0 max-sm:ml-3 absolute top-0 m-2 text-2xl uppercase tracking-widest z-10 text-white">
        Brain Spark
      </p>
      <p className="font-[Orbitron] font-extrabold max-sm:relative right-0 max-sm:m-0 max-sm:ml-3 absolute top-0 m-2 text-2xl uppercase tracking-widest z-10 text-white">{formatTime(timer)}</p>
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
