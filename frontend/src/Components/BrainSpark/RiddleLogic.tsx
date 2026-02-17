import { motion } from "framer-motion";
import type { logic_riddle } from "../../types/BrainSparkType";
import { useState } from "react";


interface RiddleLogicProps
{
  riddle:logic_riddle,
  changeQuestion?: (isCorrect:boolean) => Promise<void>
}
export const RiddleLogic = ({ riddle, changeQuestion }: RiddleLogicProps) => {
  const [loading, setLoading] = useState(false);
  const mindMazeRules: string[] = [
    "Each question presents a logical or analytical puzzle.",
    "Select the most appropriate answer from the given options.",
    "Think carefully — some questions may have tricky wording.",
    "Each correct answer gives 1 points",
    "Once an option is chosen, it cannot be changed.",
  ];

  const submitAnswer = async (userAnswer: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = riddle.answer?.trim().toLowerCase() == userAnswer.trim().toLowerCase();
      await changeQuestion?.(res);
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center gap-5 w-full max-sm:flex-col max-sm:items-center max-sm:gap-3 max-sm:m-2">
      <motion.div
        className="backdrop-blur-[1px] border font-[Orbitron] border-white text-white p-6 rounded-2xl shadow-md w-fit max-w-md bg-slate-900/50"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-[Orbitron] font-bold uppercase tracking-widest text-xl text-white mb-4">Mind Maze</p>
        {/* Question */}
        <motion.h2
          className="text-2xl tracking-wide text-white mb-4 text-left"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          🧩 {riddle.question}
        </motion.h2>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {riddle.options.map((op, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              disabled={loading}
              onClick={async () => {
                await submitAnswer(op);
              }}
              className="optionBtn px-4 py-2 rounded-xl tracking-wider font-medium text-gray-700 bg-blue-100 hover:bg-blue-200 active:bg-green-300 transform transition-all duration-200 shadow-sm disabled:opacity-50"
            >
              {op}
            </motion.button>
          ))}
        </div>
      </motion.div>
      <div className="w-96 p-6 rounded-2xl text-white shadow-md border h-full border-gray-200 bg-slate-900/50">
        <p className="font-[Orbitron] font-bold uppercase tracking-widest text-xl">Instructions</p>
          <div className="backdrop-blur-[1px] w-full mt-4 bg-purple-500/10 rounded-xl shadow-lg p-6 text-white">
  <ol className="list-decimal ml-6 space-y-2 font-[Orbitron] tracking-wider text-base">
    {mindMazeRules.map((rule, index) => (
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
