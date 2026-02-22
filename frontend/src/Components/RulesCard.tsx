import { Card, Tag } from "antd";
import {motion} from "framer-motion"
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

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
  { text: "Need to pass all the Test Cases to complete a level.", type: "important" },
  { text: "You can view the Test Case in Question Panel and Result after Run.", type: "info" },
  { text: "Only the first 3 test cases are visible. The rest are hidden to keep things interesting and test your ultimate coding logic!", type: "important" },
  { text: "All the best, participants!", type: "success" },
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
    <motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  <Card
    title={
      <span className="text-gray-200 text-lg">
        📜 Rules for the Codathon
      </span>
    }
    bordered={false}
    className="shadow-lg rounded-2xl p-4 m-5
               bg-cyan-950/50 backdrop-blur-[1px]"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">

      {/* Left Column */}
      <ul className="space-y-3">
        {rules
          .slice(0, Math.ceil(rules.length / 2))
          .map((rule, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.05,
                duration: 0.4,
                ease: "easeOut",
              }}
              whileHover={{ scale: 1.03, y: -3 }}
              className="flex items-start space-x-3 p-3 rounded-lg
                         hover:bg-white/10 transition-all duration-300"
            >
              <span className="font-bold text-gray-300">
                {index + 1}.
              </span>

              {rule.shortcut ? (
                <span className="text-gray-200">
                  <Tag
                    color="geekblue"
                    className="font-mono text-xs tracking-wide"
                  >
                    {rule.shortcut}
                  </Tag>
                  <span className="ml-2 text-gray-300">
                    {rule.info}
                  </span>
                </span>
              ) : (
                <span
                  className={`
                    ${
                      rule.type === "important"
                        ? "text-purple-400 font-semibold"
                        : rule.type === "warning"
                        ? "text-yellow-400 font-medium"
                        : rule.type === "success"
                        ? "text-green-400 font-semibold"
                        : "text-gray-300"
                    }
                  `}
                >
                  {rule.text}
                </span>
              )}

              {rule.type === "important" && (
                <InfoCircleOutlined className="ml-2 text-purple-400" />
              )}
              {rule.type === "success" && (
                <CheckCircleOutlined className="ml-2 text-green-400" />
              )}
              {rule.type === "warning" && (
                <InfoCircleOutlined className="ml-2 text-yellow-400" />
              )}
              {rule.type === "testcase" && (
                <>
                  <CheckCircleOutlined className="ml-2 text-green-400" />
                  <CloseCircleOutlined className="ml-1 text-red-400" />
                </>
              )}
            </motion.li>
          ))}
      </ul>

      {/* Right Column */}
      <ul className="space-y-3">
        {rules
          .slice(Math.ceil(rules.length / 2))
          .map((rule, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.05,
                duration: 0.4,
                ease: "easeOut",
              }}
              whileHover={{ scale: 1.03, y: -3 }}
              className="flex items-start space-x-3 p-3 rounded-lg
                         hover:bg-white/10 transition-all duration-300"
            >
              <span className="font-bold text-gray-300">
                {Math.ceil(rules.length / 2) + index + 1}.
              </span>

              {rule.shortcut ? (
                <span className="text-gray-200">
                  <Tag
                    color="geekblue"
                    className="font-mono text-xs tracking-wide"
                  >
                    {rule.shortcut}
                  </Tag>
                  <span className="ml-2 text-gray-300">
                    {rule.info}
                  </span>
                </span>
              ) : (
                <span
                  className={`
                    ${
                      rule.type === "important"
                        ? "text-purple-400 font-semibold"
                        : rule.type === "warning"
                        ? "text-yellow-400 font-medium"
                        : rule.type === "success"
                        ? "text-green-400 font-semibold"
                        : "text-gray-300"
                    }
                  `}
                >
                  {rule.text}
                </span>
              )}

              {rule.type === "important" && (
                <InfoCircleOutlined className="ml-2 text-purple-400" />
              )}
              {rule.type === "success" && (
                <CheckCircleOutlined className="ml-2 text-green-400" />
              )}
              {rule.type === "warning" && (
                <InfoCircleOutlined className="ml-2 text-yellow-400" />
              )}
              {rule.type === "testcase" && (
                <>
                  <CheckCircleOutlined className="ml-2 text-green-400" />
                  <CloseCircleOutlined className="ml-1 text-red-400" />
                </>
              )}
            </motion.li>
          ))}
      </ul>

    </div>
  </Card>
</motion.div>
  );
}
