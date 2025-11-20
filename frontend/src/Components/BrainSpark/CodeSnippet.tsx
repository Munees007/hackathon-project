import { useEffect, useState } from "react";
import type { code_snip } from "../../types/BrainSparkType";
import "../BrainSpark/CodeSnippet.css";
import { motion } from "framer-motion";
export const CodeSnippet = ({
  code,changeQuestion
}: {
  code: code_snip;
  changeQuestion?: (isCorrect: boolean) => Promise<void>;
}) => {
  const [data, setData] = useState<string>("");
  const syntaxSurgeRules: string[] = [
    "Each question contains a partially completed C program.",
    "Fill the missing syntax or function name in the blank area.",
    "Choose the correct option from the given multiple choices.",
    "Once an option is selected, it cannot be changed.",
    "Each correct answer awards 1 points.",
  ];

  useEffect(() => {
    let counter = 1;
    let temp = code.code
      // replace each "blank" with a numbered span
      .replace(/blank/g, () => `<span class='blank'>(${counter++})</span>`)
      // preserve line breaks
      .replace(/\n/g, "<br>");

    setData(temp);
  }, [code.code]);

  const submitAnswer = async (userAnswer:string) =>{
      const ans = code.answer == userAnswer
      await changeQuestion!(ans);
  }

  return (
    <div className="flex justify-center gap-5 w-full max-sm:flex-col max-sm:items-center max-sm:gap-3 max-sm:m-2">
      <div className="w-fit  p-6 rounded-2xl shadow-md border border-gray-200">
        <p className="font-[Orbitron] font-bold uppercase tracking-widest text-xl text-white mb-4">
          Syntax Surge
        </p>
        {/* 💻 Code Snippet */}
        <motion.pre
          className="parent select-none bg-purple-500/10 backdrop-blur-[1px] p-4 rounded-lg shadow-inner border border-gray-300 font-mono text-lg whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: data }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        ></motion.pre>

        {/* 🧠 Output Box */}
        {code.output && (
          <motion.div
            className="bg-gray-900 select-none text-green-400 font-mono p-4 rounded-lg mt-4 shadow-md border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm text-gray-400">Output:</span>
            <pre className="mt-1 text-base">{code.output}</pre>
          </motion.div>
        )}

        {/* ⚙️ Options Section */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {code.options.map((op: string, i: number) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={async()=>{await submitAnswer(op)}}
              className="optionBtn bg-blue-400 text-gray-900 font-semibold py-2 px-3 rounded-lg shadow-sm 
                       hover:bg-blue-500 active:bg-green-400 transition-all duration-200"
            >
              {op}
            </motion.button>
          ))}
        </div>
      </div>
      <div className="w-96  p-6 rounded-2xl text-white shadow-md border h-full border-gray-200">
        <p className="font-[Orbitron] font-bold uppercase tracking-widest text-xl">
          Instructions
        </p>
        <div className="backdrop-blur-[1px] w-full mt-4 bg-purple-500/10 rounded-xl shadow-lg p-6 text-white">
          <ol className="list-decimal ml-6 space-y-2 font-[Orbitron] tracking-wider text-base">
            {syntaxSurgeRules.map((rule, index) => (
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
