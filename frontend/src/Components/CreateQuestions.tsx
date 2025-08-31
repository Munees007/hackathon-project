import { Input, Button, Form, Space, Typography, Divider,Select } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { addQuestion } from "../Database/functions/addData";
import { questionType } from "../types/QuestionType";

const { TextArea } = Input;
const { Title } = Typography;

export default function CreateQuestionForm() {
  const [form] = Form.useForm();
  //const [levelIndex, setLevelIndex] = useState(0);
  const languages = [
    { label: "C++", value: 54 },
    { label: "Java", value: 62 },
    { label: "Python", value: 71 },
  ];
  const onFinish = async (values: any) => {
    console.log("Triggerred");
    try{
      const question:questionType = {
        title: values.title,
        content: {
          problem: values.content.problem,
          input: values.content.input,
          output: values.content.output,
          example1: {
            input: values.content.example1.input,
            output: values.content.example1.output,
          },
          example2: {
            input: values.content.example2.input,
            output: values.content.example2.output,
          },
          testCase: values.content.testCase.map((testCase:any, index:number) => ({
            ...testCase,
            isCorrect: false, // Default value
            testCaseNo: index + 1, // Assigning test case number
          })),
          boilerCode: values.content.boilerCode || [],
        },
      }
      await addQuestion(question,values.levelIndex);
      console.log("Final Question Data:", values);
    }
    catch(error){
      console.error("Error adding question:", error);
      // Handle error (e.g., show notification)
    }
    
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <Title level={2} className="text-center">
        Create New Question
      </Title>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        onFinishFailed={(errorInfo) => {
    console.log("❌ Validation Failed:", errorInfo);
  }}
        initialValues={{
          content: {
            example1: { input: "", output: "" },
            example2: { input: "", output: "" },
            testCase: [],
          },
        }}
      >
        <Form.Item label="Select Level" name="levelIndex" rules={[{ required: true }]}>
          <Select
            placeholder="Select Level"
            
            options={[
              { label: "Level 1", value: 0 },
              { label: "Level 2", value: 1 },
              { label: "Level 3", value: 2 },
            ]}
          ></Select>
        </Form.Item>
        <Form.Item name="title" label="Question Title" rules={[{ required: true }]}>
          <Input placeholder="Enter question title" />
        </Form.Item>

        <Divider />

        <Form.Item name={["content", "problem"]} label="Problem Statement" rules={[{ required: true }]}>
          <TextArea rows={4} placeholder="Describe the problem" />
        </Form.Item>

        <Form.Item name={["content", "input"]} label="Input Format" rules={[{ required: true }]}>
          <TextArea rows={2} placeholder="Describe the input format" />
        </Form.Item>

        <Form.Item name={["content", "output"]} label="Output Format" rules={[{ required: true }]}>
          <TextArea rows={2} placeholder="Describe the output format" />
        </Form.Item>

        <Divider>Examples</Divider>
        <Form.Item label="Example 1 Input" name={["content", "example1", "input"]}>
          <TextArea rows={2} placeholder="Example input" />
        </Form.Item>
        <Form.Item label="Example 1 Output" name={["content", "example1", "output"]}>
          <TextArea rows={2} placeholder="Example output" />
        </Form.Item>

        <Form.Item label="Example 2 Input" name={["content", "example2", "input"]}>
          <TextArea rows={2} placeholder="Example input" />
        </Form.Item>
        <Form.Item label="Example 2 Output" name={["content", "example2", "output"]}>
          <TextArea rows={2} placeholder="Example output" />
        </Form.Item>

        <Divider>Test Cases</Divider>
        <Form.List name={["content", "testCase"]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} className="flex mb-4" align="baseline">
                  <Form.Item {...restField} name={[name, "input"]} rules={[{ required: true }]} label="Input">
                    <Input placeholder="Test case input" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "output"]} rules={[{ required: true }]} label="Expected Output">
                    <Input placeholder="Expected output" />
                  </Form.Item>
                  <Button type="text" icon={<MinusCircleOutlined />} onClick={() => remove(name)} danger />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  className="w-full"
                >
                  Add Test Case
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider>Boilerplate Code (Optional per Language)</Divider>
<Form.List name={["content", "boilerCode"]}>
  {(fields, { add, remove }) => (
    <>
      {fields.map(({ key, name, ...restField }) => (
        <div key={key} className="mb-6 p-4 border rounded-lg">
          <Space align="baseline" className="w-full justify-between">
            <Form.Item
              {...restField}
              name={[name, "languageCode"]}
              label="Language"
              rules={[{ required: true, message: "Select a language" }]}
              className="w-full"
            >
              <Select placeholder="Select language">
                {languages.map((lang) => (
                  <Select.Option key={lang.value} value={lang.value}>
                    {lang.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Button type="text" icon={<MinusCircleOutlined />} onClick={() => remove(name)} danger />
          </Space>

          <Form.Item {...restField} name={[name, "funtionSignature"]} label="Function Signature">
            <TextArea rows={2} placeholder="e.g., bool isArmstrong(int n)" />
          </Form.Item>

          <Form.Item {...restField} name={[name, "boilerCodeTop"]} label="Boilerplate Code (Top)">
            <TextArea rows={2} placeholder="Code before function" />
          </Form.Item>

          <Form.Item {...restField} name={[name, "boilerCodeBottom"]} label="Boilerplate Code (Bottom)">
            <TextArea rows={2} placeholder="Code after function" />
          </Form.Item>
        </div>
      ))}
      <Form.Item>
        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
          Add Boilerplate Code
        </Button>
      </Form.Item>
    </>
  )}
</Form.List>
      <Form.Item>
        <Button htmlType="submit"  type="primary">Add Question</Button>
      </Form.Item>
      </Form>
    </div>
  );
}
