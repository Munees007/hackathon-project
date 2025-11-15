import { motion } from "framer-motion";
import type { logic_riddle } from "../../types/BrainSparkType";



export const RiddleLogic = ({ question, options }: logic_riddle) => {
  const mindMazeRules: string[] = [
  "Each question presents a logical or analytical puzzle.",
  "Select the most appropriate answer from the given options.",
  "Think carefully — some questions may have tricky wording.",
  "Each correct answer gives 10 points",
  "Once an option is chosen, it cannot be changed."
];
  return (
    <div className="flex justify-center gap-5 w-full max-sm:flex-col max-sm:items-center max-sm:gap-3 max-sm:m-2">
      
    <motion.div
      className="bg-purple-500/10 backdrop-blur-[1px] border font-[Orbitron] border-white text-white p-6 rounded-2xl shadow-md w-fit max-w-md"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="font-[Orbitron] font-bold uppercase tracking-widest text-xl text-white mb-4">Mind Maze</p>
      {/* Question */}
      <motion.h2
        className="text-2xl  tracking-wide text-white mb-4 text-left"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        🧩 {question}
      </motion.h2>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((op, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className="optionBtn px-4 py-2 rounded-xl tracking-wider font-medium text-gray-700 bg-blue-100 hover:bg-blue-200 active:bg-green-300 transform transition-all duration-200 shadow-sm"
          >
            {op}
          </motion.button>
        ))}
      </div>
    </motion.div>
    <div className="w-96  p-6 rounded-2xl text-white shadow-md border h-full border-gray-200">
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
