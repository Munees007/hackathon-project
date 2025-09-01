import { Card, Tag } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";

const rules = [
  { text: "Avoid refreshing the page.", type: "info" },
  { text: "Your program will be auto-saved.", type: "info" },
  { shortcut: "Alt + R", info: "Run the program." },
  { shortcut: "Alt + S", info: "Submit the program." },
  { shortcut: "Alt + Q", info: "Open the question panel." },
  { shortcut: "Alt + N", info: "Toggle Fullscreen mode on/off for code editor." },
  { text: "You must complete the current level to unlock the next one.", type: "warning" },
  { text: "Supported languages: C++, Java, and Python.", type: "info" },
  { text: "You don’t need to write the entire code from scratch.", type: "info" },
  { text: "Focus on understanding the problem and implement logic within the given function.", type: "info" },
  { text: "All test cases must pass for a successful submission.", type: "important" },
  { text: "All the best, participants!", type: "success" },
  { text: "Need to pass all the Test Cases to complete a level.", type: "important" },
  { text: "You can view the Test Case in Question Panel and Result of TestCase after Run.", type: "info" },
  {
    text: (
      <>
        In Test Case{" "}
        <Tag color="red" className="font-semibold">
          Failed
        </Tag>{" "}
        indicates failure, and{" "}
        <Tag color="green" className="font-semibold">
          Passed
        </Tag>{" "}
        indicates success.
      </>
    ),
    type: "testcase",
  },
];

export default function RulesCard() {
  return (
    <Card
      title="📜 Instructions"
      bordered={false}
      className="shadow-lg rounded-2xl p-4 bg-gradient-to-br from-white via-gray-50 to-gray-100"
    >
      <ul>
        {rules.map((rule, index) => (
          <li
            key={index}
            className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition"
          >
            <span className="font-bold text-gray-500">{index + 1}.</span>

            {rule.shortcut ? (
              <span className="text-gray-800">
                <Tag color="blue" className="font-mono text-sm">
                  {rule.shortcut}
                </Tag>
                {rule.info && <span className="ml-2">{rule.info}</span>}
              </span>
            ) : (
              <span
                className={`text-gray-800 ${
                  rule.type === "important"
                    ? "font-semibold text-purple-600"
                    : rule.type === "warning"
                    ? "text-yellow-600 font-medium"
                    : rule.type === "success"
                    ? "text-green-600 font-semibold"
                    : ""
                }`}
              >
                {rule.text}
              </span>
            )}

            {rule.type === "important" && (
              <InfoCircleOutlined className="ml-2 text-purple-500" />
            )}
            {rule.type === "success" && (
              <CheckCircleOutlined className="ml-2 text-green-500" />
            )}
            {rule.type === "warning" && (
              <InfoCircleOutlined className="ml-2 text-yellow-500" />
            )}
            {rule.type === "testcase" && (
              <>
                <CheckCircleOutlined className="ml-2 text-green-500" />
                <CloseCircleOutlined className="ml-1 text-red-500" />
              </>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
