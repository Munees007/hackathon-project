import { useState } from "react";
import { List, Button, Select, Drawer, Typography, Card } from "antd";
import { EyeOutlined } from "@ant-design/icons";

import { CodeSnippet } from "../BrainSpark/CodeSnippet";
import { RiddleLogic } from "../BrainSpark/RiddleLogic";
import { AlgorithmDrag } from "../BrainSpark/AlgorithmDrag";
import type { QuestionItem, QuestionType } from "../../types/BrainSparkType";






interface Props {
  questions: QuestionItem[];
}
const { Text } = Typography;
export const ViewBrainSparkQuestions = ({ questions }: Props) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionItem | null>(null);
  const [filterType, setFilterType] = useState<QuestionType | "all">("all");

  const filteredQuestions = filterType === "all"
    ? questions
    : questions.filter(q => q.type === filterType);

  const handlePreview = (question: QuestionItem) => {
    console.log(question)
    setSelectedQuestion(question);
    setDrawerOpen(true);
  };

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">BrainSpark Questions</h2>
        <Select
          value={filterType}
          onChange={(val) => setFilterType(val)}
          style={{ width: 200 }}
        >
          <Select.Option value="all">All Types</Select.Option>
          <Select.Option value="code_snip">Syntax Surge</Select.Option>
          <Select.Option value="logic_riddle">Mind Maze</Select.Option>
          <Select.Option value="map_algorithm">Flow Forge</Select.Option>
        </Select>
      </div>

     <List
  bordered={false}
  dataSource={filteredQuestions}
  renderItem={(item) => (
    <Card
      key={item.id}
      hoverable
      style={{
        marginBottom: "16px",
        borderRadius: "10px",
        border: "1px solid #f0f0f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
      }}
    >
      <List.Item
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0px 0",
        }}
        actions={[
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(item)}
            style={{
              borderRadius: "6px",
              boxShadow: "0 2px 6px rgba(22,119,255,0.25)",
            }}
          >
            Preview
          </Button>,
        ]}
      >
        <div>
          <Text strong style={{ fontSize: "15px", color: "#333" }}>
            {item.type.toUpperCase()}
          </Text>
          <Text style={{ marginLeft: "8px", color: "#888" }}>
            — Added by <span style={{ color: "#1677ff" }}>{item.addedBy}</span>
          </Text>
        </div>
      </List.Item>
    </Card>
  )}
/>

      <Drawer
        title="Preview Question"
        placement="right"
        width="100%"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        {selectedQuestion && (
            <>
          <p className="absolute z-10 right-5 font-semibold top-5 mb-2">
          <span className="font-bold text-blue-500">Added By:</span>{" "}
          {selectedQuestion.addedBy || "N/A"}
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

            {selectedQuestion.type === "code_snip" && (
              <CodeSnippet
                code={{
                  code: selectedQuestion.question || "",
                  options: selectedQuestion.options || [],
                  output: selectedQuestion.output || "",
                }}
              />
            )}

            {selectedQuestion.type === "logic_riddle" && (
              <RiddleLogic
                question={selectedQuestion.question || ""}
                options={selectedQuestion.options || []}
              />
            )}

            {selectedQuestion.type === "map_algorithm" && (
              <AlgorithmDrag algorithm={selectedQuestion.algorithm || []} />
            )}
            </div>
          </div>
          </>
        )}
      </Drawer>
    </div>
  );
};
