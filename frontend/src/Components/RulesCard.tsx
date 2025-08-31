import { Card } from "antd";

const rules = [
  { text: "Avoid refreshing the page." },
  { text: "Your program will be auto-saved." },
  { shortcut: "Alt + R", info: "Run the program." },
  { shortcut: "Alt + S", info: "Submit the program." },
  {shortcut: "Alt + Q", info: "Open the question panel."},
  {shortcut:"Alt + N",info:"Toogle Fullscreen mode on/off for code editor."},
  { text: "You must complete the current level to unlock the next one." },
  { text: "Supported languages: C++, Java, and Python." },
  { text: "You don’t need to write the entire code from scratch." },
  { text: "Focus on understanding the problem and implement logic within the given function." },
  { text: "All test cases must pass for a successful submission." },
  { text: "All the best, participants!" },
];


export default function RulesCard() {
  return (
    <Card
      title="Instructions"
      bordered={false}
      className="shadow-lg rounded-2xl p-4"
    >
      <ul className="space-y-3">
        {rules.map((rule, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-3 font-bold text-gray-600">{index + 1}.</span>
            {rule.shortcut ? (
              <span className="text-gray-800">
                <span className="px-2 py-1 bg-gray-100 border rounded-md font-mono text-sm text-blue-600 shadow-sm">
                  {rule.shortcut}
                </span>
                {rule.info && <span className="ml-2">{rule.info}</span>}
              </span>
            ) : (
              <span className="text-gray-800">{rule.text}</span>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
