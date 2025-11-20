import { useState } from "react";
import { Input, Select, Button, Drawer, Form } from "antd";
import { CodeSnippet } from "../BrainSpark/CodeSnippet";
import { RiddleLogic } from "../BrainSpark/RiddleLogic";
import { AlgorithmDrag } from "../BrainSpark/AlgorithmDrag";
import { push, ref } from "firebase/database";
import { db } from "../../Database/firebase";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css"
import type { QuestionType } from "../../types/BrainSparkType";
const { TextArea } = Input;
const { Option } = Select;



export const AddBrainSparkQuestions = () => {
  const [type, setType] = useState<QuestionType>("code_snip");
  const [addedBy, setAddedBy] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [output, setOutput] = useState<string>("");
  const [algorithm, setAlgorithm] = useState<string[]>([]);
  const [correctOrder, setCorrectOrder] = useState<string[]>([]);
    const [answer,setAnswer] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
const [form] = Form.useForm();

  const handleOptionChange = (value: string, index: number) => {
    const copy = [...options];
    copy[index] = value;
    setOptions(copy);
  };

  const handleAddQuestion = async () => {
    if (!addedBy) return toast.error("Please enter your name");
    if (!question && type !== "map_algorithm") return toast.error("Please enter a question");
    if (type === "map_algorithm" && algorithm.length === 0)
      return toast.error("Please enter algorithm steps");
    if (type === "map_algorithm" && algorithm.length > 6)
      return toast.error("algorithm steps should not exceed 6");
    let payload: any;
    if (type === "code_snip") {
      payload = { code: question, options, output, addedBy,answer, createdAt: Date.now() };
    } else if (type === "logic_riddle") {
      payload = { question, options, addedBy,answer, createdAt: Date.now() };
    } else if (type === "map_algorithm") {
      payload = { algorithm, correctOrder: correctOrder.length ? correctOrder : algorithm, addedBy, createdAt: Date.now() };
    }
    console.log(payload)
    try {
      const dbRef = ref(db, `brainspark/${type}`);
      await push(dbRef, payload);
      toast.success("Question added successfully!");

      form.resetFields();
      // Optionally clear form
      setQuestion("");
      setOptions(["", "", "", ""]);
      setOutput("");
      setAlgorithm([]);
      setCorrectOrder([]);
      setAddedBy("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add question");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6">

      {/* Form */}
      <div className="bg-gray-50 p-6 rounded-2xl shadow-md border border-gray-200 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Add a Question
          </h2>
          <Button onClick={() => setDrawerOpen(true)}>Preview Question</Button>
        </div>

<Form
form={form}
  layout="vertical"
  onFinish={handleAddQuestion} // this will only run if all required fields pass
>
  <Form.Item label="Question Type" name="type" initialValue={type} rules={[{ required: true }]}>
    <Select onChange={(val) => setType(val)}>
      <Option value="code_snip">Syntax Surge</Option>
      <Option value="logic_riddle">Mind Maze</Option>
      <Option value="map_algorithm">Flow Forge</Option>
    </Select>
  </Form.Item>

  <Form.Item label="Added By" name="addedBy" rules={[{ required: true, message: "Please enter your name" }]}>
    <Input value={addedBy} onChange={(e) => setAddedBy(e.target.value)} />
  </Form.Item>

  <Form.Item
    label={type === "map_algorithm" ? "Algorithm Steps" : type === "code_snip" ? "Code" : "Coding Riddle"}
    name="question"
    rules={[{ required: true, message: "This field is required" }]}
  >
    <TextArea
      rows={3}
      placeholder={type === "map_algorithm" ? "Algorithm Steps (one per line)" : type==="code_snip" ?"Code":"Riddle"}
      value={type === "map_algorithm" ? algorithm.join("\n") : question}
      onChange={(e) =>
        type === "map_algorithm"
          ? setAlgorithm(e.target.value.split("\n"))
          : setQuestion(e.target.value)
      }
    />
  </Form.Item>

 {(type === "code_snip" || type === "logic_riddle") && (
  <div className="mb-4">
    <h3 className="font-semibold text-gray-700 mb-2"><span className="text-red-500">*</span> Options</h3>
    <div className="grid grid-cols-2 gap-3">
    {options.map((opt, idx) => (
      <Form.Item
        key={idx}
        name={`option${idx}`}
        
        rules={[{ required: true, message: `Option ${idx + 1} is required` }]}
        style={{ marginBottom: "0.5rem" }}
      >
        <Input
          placeholder={`Enter Option ${idx + 1}`}
          value={opt}
          onChange={(e) => handleOptionChange(e.target.value, idx)}
        />
      </Form.Item>
    ))}

    
    </div>
  </div>
)}

{type === "code_snip" && ( 
    <Input placeholder="Expected Output (optional)" 
    value={output} onChange={(e) => setOutput(e.target.value)} style={{marginBottom:"0.75rem"}} /> )}
{type === "map_algorithm" && (
    <Form.Item
    label={"Corect Alogrithm Steps"}
    name="correctAlgorithm"
    rules={[{ required: true, message: "This field is required" }]}
  >
    <TextArea
      rows={3}
      value={correctOrder.join("\n")}
      placeholder="Correct Order (one per line, optional)"
      onChange={(e) =>
        
          setCorrectOrder(e.target.value.split("\n"))
          
      }
    />
  </Form.Item>
 )}

 {
    (type === "code_snip" || type==="logic_riddle") && (
        <Form.Item label="Answer" name="answer" rules={[{ required: true, message: "Please enter answer" }]}>
    <Input value={answer} onChange={(e) => setAnswer(e.target.value)} />
  </Form.Item>
    )
 }
  <Button type="primary" htmlType="submit" className="w-full">
    Add Question
  </Button>
</Form>

      </div>

      {/* Drawer for live preview */}
      <Drawer
        title="Preview Question"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={"100%"}
      >
         <p className="absolute z-10 right-5 font-semibold top-5 mb-2">
          <span className="font-bold text-blue-500">Added By:</span>{" "}
          {addedBy || "N/A"}
        </p>
        <div className=" w-full bg-[#020617] relative">
            
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
          <div className="relative z-10 h-screen flex-col flex justify-center items-center max-sm:h-full">
          {type === "code_snip" && (
            
          <CodeSnippet
            code={{
              code: question,
              options: options,
              output: output,
            }}
            
          />
        )}

        {type === "logic_riddle" && (
          <RiddleLogic riddle={{question:question,options:options}}  />
        )}

        {type === "map_algorithm" && <AlgorithmDrag  algorithm={{algorithm:algorithm}} />}
        </div>
        </div>
       

        {/* {type === "code_snip" && (
            
          <CodeSnippet
            code={{
              code: question,
              options: options,
              output: output,
            }}
          />
        )}

        {type === "logic_riddle" && (
          <RiddleLogic question={question} options={options} />
        )}

        {type === "map_algorithm" && <AlgorithmDrag algorithm={algorithm} />} */}
      </Drawer>

    </div>
  );
};
