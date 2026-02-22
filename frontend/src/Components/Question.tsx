import { VscCode } from "react-icons/vsc";
import '../Modules/themes';
import { answerType, questionType } from "../types/QuestionType";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface QuestionProps{
    questionNo:number,
    question:questionType,
    theme:string,
    setQuestion:(value: number, status: boolean, useLevel: boolean, level: number) =>void,
    setShowQuestion: (value: React.SetStateAction<boolean>) => void,
    level:number,
    useLevel:boolean,
    codeDataChanged:boolean
}

export default function Question({
    questionNo,
    question,
    setQuestion,
    theme,
    level,
    useLevel,
    setShowQuestion,
    codeDataChanged
}:QuestionProps) {

    const [showDetails,setShowDetails] = useState<boolean>(false);

    useEffect(()=>{
        const temp = localStorage.getItem("codeData");

        if(temp)
        {
            const codeData:answerType = JSON.parse(temp)

            let res = true;

            codeData.finalAnswer[level].answer.forEach((data,index)=>{
                if(index < questionNo-1)
                {
                    if(!data.answered)
                    {
                        res = false
                    }
                }
            })

            setShowDetails(res)
        }
        else
        {
            setShowDetails(questionNo === 1)
        }

    },[codeDataChanged])

    const handleQuestion = ()=>{
        if(!showDetails)
        {
            toast.warning("Complete previous questions to unlock this 🔒");
            return;
        }
        setQuestion(questionNo,false,useLevel,level);
    }

    const handleFullQuestion = ()=>{
        if(!showDetails)
        {
            toast.warning("Complete previous questions to unlock this 🔒");
            return;
        }
        setShowQuestion(true);
        setQuestion(questionNo,true,useLevel,level);
    }

    return (
    <div
        className={`
            ace-${theme ? theme : "dracula"}
            m-3
            rounded-xl
            p-4
            border
            shadow-lg
            transition-all
            duration-300
            hover:scale-[1.02]
            ${showDetails 
                ? "border-green-500 shadow-green-500/20"
                : "border-gray-600 opacity-70 cursor-not-allowed"}
        `}
    >
        <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">
                {questionNo}. {showDetails ? question.title : "🔒 Locked"}
            </p>
        </div>

        <span className="w-full flex justify-end mt-2">
            <p
                className={`text-sm transition ${
                    showDetails
                        ? "cursor-pointer hover:text-blue-400"
                        : "text-gray-500"
                }`}
                onClick={handleFullQuestion}
            >
                Read more...
            </p>
        </span>

        <div className="w-full flex justify-end mt-4" title="Start coding">
            <VscCode
                size={28}
                className={`
                    transition
                    duration-300
                    ${showDetails
                        ? "cursor-pointer hover:text-green-400"
                        : "text-gray-500"}
                `}
                onClick={handleQuestion}
            />
        </div>
    </div>
  )
}