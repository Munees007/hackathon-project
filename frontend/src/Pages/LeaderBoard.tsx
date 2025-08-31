import { useEffect, useState } from "react";
import { answerType, Level } from "../types/QuestionType";
import { getData, getLevelsData } from "../Database/functions/addData";
import { userDataType } from "./Admin";
import { FormData } from "../Components/Form";
import Lottie from "lottie-react";
import rabitAni from "../assets/animations/Rabbit.json";
import turtleAni from "../assets/animations/turtle circle walk.json";
import  CountUp from "react-countup";
import { Fireworks } from "@fireworks-js/react";
export const LeaderBoard = () =>{

    const [codeData,setCodeData] = useState<answerType[]>([]);
    const [_,setUserData] = useState<FormData[]>([]);
    
    const [bestWorst,setBestWorst] = useState<{best:number,worst:number}>({
        best:0,
        worst:0
    })
    const [currentLevel,setCurrentLevel] = useState<number>(-1);
    const [questions,setQuestions] = useState<Level[]>([]);
    const [__,setNeverFinished] = useState<number>(0);
    useEffect(() =>{
        const countBest_Worst = (e:KeyboardEvent)=>{
                console.log("Key pressed:", e.key);
                console.log("Questions:", questions.length);
                let index = parseInt(e.key)-1;
                if((isNaN(index) || index < 0 || index >= questions.length)) return;
                console.log("Valid index:", index);
                setCurrentLevel(index);
                const levelQuestionCount = questions[index].questions.length;
                let bestCount = 0;
                let worstCount = 0;
                codeData.forEach((data)=>{
                    const answeredQuestions = data.finalAnswer;
                    let answeredCount = 0;
                    answeredQuestions.forEach((question)=>{
                        question.answer.forEach((ans)=>{
                            
                            if(ans.answered && ans.levelIndex === index)
                            {
                                console.log("Checking answer:", ans);
                                answeredCount++;
                            }
                        })
                    })
                    console.log("Answered Count for Level", index + 1, ":", answeredCount);
                    if(answeredCount === levelQuestionCount)
                    {
                        bestCount++;
                    }
                    else
                    {
                        worstCount++;
                    }
                    
                })
                setBestWorst({
                    best:bestCount,
                    worst:worstCount
                })
                console.log("Best Count:", bestCount, "Worst Count:", worstCount);
        }
        document.addEventListener("keypress", countBest_Worst);
        return () => {
            document.removeEventListener("keypress", countBest_Worst);
        }
    },[questions,codeData]);

    useEffect(()=>{
        const fetchData = async () =>{
            console.log("Fetching data...");
            const codeD = await getData();
            const data = Object.entries(codeD).map(([_, value]) => ({
                    ...(value as userDataType),
                  }));
            const available = data
  .filter(user => user.codeData !== undefined)
  .map(user => user.codeData);
                  console.log("available",available);
            const missingCount = data.filter(user => user.codeData === undefined).length;
            setNeverFinished(missingCount);
            setUserData(data.map(user => user.formData));
            setCodeData(available);
            const questionData = await getLevelsData();
            console.log("Question Data:", questionData);
            if (questionData) {
        setQuestions(questionData);
        
      } else {
        console.warn("No question data received");
      }
            
        }
        fetchData();
    },[])
    return(
        <div className="p-3 flex flex-col items-center gap-3 justify-between w-full h-screen bg-[#f6f7eb]">
  <p className="text-center text-3xl font-Orbiton uppercase font-bold tracking-[1.5rem]">
    Leader Board
  </p>
  <div className="w-full flex h-full gap-1">
    
    <div className="w-full relative bg-[#e94f37] rounded-md flex flex-col justify-center items-center">
        <p className="absolute top-3 right-0 text-3xl font-bold font-Orbiton tracking-[1.5rem]">LEV</p>
      <Lottie animationData={rabitAni} loop={true} className="w-96" />
      <div className="flex font-Orbiton flex-col items-center justify-center gap-2 px-10 m-2 w-fit">
        <p className="text-3xl font-bold uppercase tracking-widest">Finished Level</p>
        <p className="text-4xl font-bold">
          <CountUp end={bestWorst.best} duration={2} />
        </p>
      </div>
    </div>

    <div className="w-full relative bg-[#393e41] rounded-md flex flex-col justify-center items-center">
        <p className="text-3xl text-white absolute top-3 tracking-[1.5rem] font-bold font-Orbiton left-4">EL {currentLevel !== -1 ? currentLevel : "?"}</p>
      <Lottie animationData={turtleAni} loop={true} className="w-96" />
      <div className="flex font-Orbiton text-white flex-col items-center justify-center gap-2 px-10 m-2 w-fit">
        <p className="text-3xl font-bold uppercase tracking-widest">Not Finished Level</p>
        <p className="text-4xl font-bold">
          <CountUp end={bestWorst.worst} duration={2} />
        </p>
      </div>
    </div>
  </div>

  <Fireworks
      options={{
        acceleration: 1.05,
        friction: 0.97,
        gravity: 1.5,
        traceSpeed: 5,
        intensity: 40,
      }}
      style={{
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        position: "fixed",
         // optional background
      }}
    />
</div>
    );
}