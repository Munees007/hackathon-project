
import { CodeSnippet } from "../Components/BrainSpark/CodeSnippet";
import type { code_snip } from "../types/BrainSparkType";

export const BrainSpark = () =>{

//     const code:code_snip = {
//         code:`
// #include &lt;stdio.h&gt;
// int main() {
//     blank("Hello World");
//     return 0;
// }
// `,
// options:["cout","print","printf","echo"]
//     }

    const code1:code_snip = {
        code:`
#include &lt;stdio.h&gt;
int main() {
    blank("Hello World");
    return 0;
}
`,
output:"Hi",
options:["cout","print","printf","echo"]
    }
    return(
        <div className="min-h-screen w-full bg-[#020617] relative">
            <p className="font-[Orbitron] font-extrabold max-sm:relative max-sm:m-0 max-sm:ml-3 absolute top-0 m-2 text-2xl uppercase tracking-widest z-10 text-white">Brain Spark</p>
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
            <CodeSnippet code={code1}/>
  {/* <RiddleLogic question="I connect people but have no wires. I can crash but still not die. What am I?" options={["Internet", "Server", "Mobile App", "Network"]}></RiddleLogic> */}
  {/* <AlgorithmDrag algorithm={[
  "Start the program",
  "Declare two integer variables: a and b",
  "Read the values of a and b from the user",
  "Calculate sum = a + b",
  "Display the value of sum",
  "Stop the program"
]}/> */}
</div>

<div className="absolute right-3 bottom-3">
    
</div>
</div>

    );
}