import { useEffect, useState } from "react";
import type { map_algorithm } from "../../types/BrainSparkType";
import { BiDownArrowAlt, BiUpArrowAlt } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";

interface AlgorithmDragProps
{
  algorithm: map_algorithm,
  changeQuestion?: (isCorrect:boolean) => Promise<void>
}
export const AlgorithmDrag = ({ algorithm,changeQuestion }: AlgorithmDragProps) => {
  const [data, setData] = useState<string[]>([]);
const flowForgeRules: string[] = [
  "You will see a list of shuffled algorithm steps.",
  "Rearrange them into the correct logical order using the up and down arrows.",
  "Once satisfied, click the 'Submit Order' button to lock your answer.",
  "Each correctly ordered algorithm awards 1 points.",
  "You can only submit once per question."
];
  const handleOrder = (order: "top" | "bottom", index: number) => {
    if (order === "top" && index === 0) return;
    if (order === "bottom" && index === data.length - 1) return;

    const copy = [...data];
    const temp = copy[index];

    if (order === "top") {
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
    } else {
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
    }

    setData(copy);
  };

  useEffect(() => {
    setData(algorithm.algorithm);
  }, [algorithm]);

  const submitAnswer = async ()=>{
    const res = algorithm.algorithm.map((value)=> value.trim().toLowerCase()) == data.map((value)=> value.trim().toLowerCase())
    await changeQuestion!(res)
  }
  return (
    <div className="flex justify-center gap-5 w-full max-sm:flex-col max-sm:items-center max-sm:gap-3 max-sm:m-2">
    <div className="max-w-md p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col">
      <p className="font-[Orbitron] font-bold uppercase tracking-widest text-xl text-white mb-4">Flow Forge</p>
      <AnimatePresence>
        {data?.map((d, index) => (
          <motion.div
            key={d}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex justify-between items-center bg-purple-500/10 backdrop-blur-[1px] gap-3 border border-white/30 max-w-md px-4 py-3 mt-2 ml-2 rounded-lg shadow-md"
          >
            <p className="font-medium text-white">{d}</p>
            <div className="flex  gap-1">
              <button
                className="bg-white hover:bg-gray-100 active:bg-gray-200 rounded-lg p-1 shadow-md"
                onClick={() => handleOrder("top", index)}
                aria-label="Move up"
              >
                <BiUpArrowAlt size={24} />
              </button>
              <button
                className="bg-white hover:bg-gray-100 active:bg-gray-200 rounded-lg p-1 shadow-md"
                onClick={() => handleOrder("bottom", index)}
                aria-label="Move down"
              >
                <BiDownArrowAlt size={24} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <button className="font-[Orbitron]  uppercase tracking-widest bg-green-500/40  py-2 mx-10 hover:scale-105 cursor-pointer active:bg-green-500/10 active:scale-95 hover:bg-purple-500/10 transition-all rounded-lg mt-2 backdrop-blur-[1px] text-white" onClick={submitAnswer}>Submit</button>
    </div>
    <div className="w-96  p-6 rounded-2xl text-white shadow-md border h-full border-gray-200">
          <p className="font-[Orbitron] font-bold uppercase tracking-widest text-xl">Instructions</p>
          <div className="backdrop-blur-[1px] w-full mt-4 bg-purple-500/10 rounded-xl shadow-lg p-6 text-white">
  <ol className="list-decimal ml-6 space-y-2 font-[Orbitron] tracking-wider text-base">
    {flowForgeRules.map((rule, index) => (
      <li key={index} className="leading-relaxed">
        {rule}
      </li>
    ))}
  </ol>
  
</div>
    </div>
    </div>
  );
};
