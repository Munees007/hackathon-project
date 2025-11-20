import { get, ref } from "firebase/database";
import { QuestionItem, QuestionType } from "../types/BrainSparkType";
import { db } from "./firebase";

export const getQuestions = async ():Promise<QuestionItem[]> =>{

    const brainSparkRef = ref(db,"/brainspark")
    const questions:QuestionItem[] = []
    const res = await get(brainSparkRef);
    if(res.exists())
    {
        const data = res.val();

        Object.entries(data).map((d)=>{
            Object.entries(d[1]!).map((value)=>{
                if(value)
                {
                    
                    const t = value[1]
                    const type = d[0] as QuestionType
                    questions.push({
                        type:type,
                        addedBy:t.addedBy,
                        algorithm:t.algorithm ?? [],
                        correctOrder:t.correctOrder ?? [],
                        options:t.options ?? [],
                        output:t.output ?? "",
                        question:type == "code_snip" ? t.code : t.question ?? "",
                        id:value[0],
                        answer:t.answer
                    });
                }
                
            })
        })
        
    }
    return questions;

}