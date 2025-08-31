import React, { useEffect, useState } from "react";
import { Input, Button, Form, Radio, Spin } from "antd";
import { FeedbackType } from "../types/QuestionType";
import { FormData } from "../Components/Form";
import { getDatabase, ref, set } from "firebase/database";
import { app } from "../Database/firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
const { TextArea } = Input;

interface FeedBackProps {
  isView: boolean;
  feedBackData?: FeedbackType;
}
export const FeedBack:React.FC<FeedBackProps> = ({isView,feedBackData}) => {
  const [userData,setUserData] = useState<FormData>(() => {
    const data = localStorage.getItem("userData");
    return data ? JSON.parse(data) : null;
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // Ant Design form instance
  const db = getDatabase(app);

  useEffect(() => {
    if(isView && feedBackData){
      form.setFieldsValue({
        aboutWebsite: feedBackData.aboutWebsite,
        aboutOrganization: feedBackData.aboutOrganization,
        whatYouLiked: feedBackData.whatYouLiked,
        improvements: feedBackData.improvements,
        additionalComments: feedBackData.additionalComments,
      });
      setUserData(feedBackData.user);
    }
  },[])

  const onFinish = async (values: any) => {
    if (!userData && !isView) {
      toast.error("User data not found!");
      return;
    }

    const feedback: FeedbackType = {
      user: userData,
      aboutWebsite: values.aboutWebsite,
      aboutOrganization: values.aboutOrganization,
      whatYouLiked: values.whatYouLiked,
      improvements: values.improvements || "N/A",
      additionalComments: values.additionalComments || "N/A",
      createdAt: Date.now(),
    };

    try {
      setLoading(true);
      await set(ref(db, `feedback/${userData.rollNumber}`), feedback);
      toast.success("Thanks for your feedback!");

      setTimeout(() => navigate("/thankYou"), 2000);
      form.resetFields(); // clear form
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-start min-h-screen 
                 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600
                 animate-gradient p-4 overflow-y-auto`}
    >
      {loading && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-50">
          <Spin size="large" />
        </div>
      )}

      <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 drop-shadow-lg">
        Hackathon Feedback
      </h1>

      {userData && (
        <div className="mb-4 p-4 rounded-lg bg-white/80 text-black shadow-md w-full max-w-lg border border-gray-200">
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Roll No:</strong> {userData.rollNumber}</p>
          <p><strong>Class:</strong> {userData.className}</p>
          <p><strong>Email:</strong> {userData.email}</p>
        </div>
      )}

      <div className="w-full max-w-lg bg-white/80 p-4 rounded-xl shadow-lg border border-gray-200">
        <Form className={`${isView ? "pointer-events-none" : "pointer-events-auto"}`} layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item
            name="aboutWebsite"
            label={<span className="font-semibold text-black">What do you think about the website?</span>}
            rules={[{ required: true }]}
          >
            <Radio.Group className="flex flex-col gap-2 text-black">
              <Radio value="Excellent">Excellent</Radio>
              <Radio value="Good">Good</Radio>
              <Radio value="Average">Average</Radio>
              <Radio value="Poor">Poor</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="aboutOrganization"
            label={<span className="font-semibold text-black">How well was the event organized?</span>}
            rules={[{ required: true }]}
          >
            <Radio.Group className="flex flex-col gap-2 text-black">
              <Radio value="Very Well">Very Well</Radio>
              <Radio value="Well">Well</Radio>
              <Radio value="Needs Improvement">Needs Improvement</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="whatYouLiked"
            label={<span className="font-semibold text-black">What did you like the most?</span>}
            rules={[{ required: true }]}
          >
            <Radio.Group className="flex flex-col gap-2 text-black">
              <Radio value="Event Activities">Event Activities</Radio>
              <Radio value="Team Coordination">Team Coordination</Radio>
              <Radio value="Prizes & Recognition">Prizes & Recognition</Radio>
              <Radio value="Overall Experience">Overall Experience</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="improvements"
            label={<span className="font-semibold text-black">What could be improved?</span>}
          >
            <TextArea
              rows={3}
              placeholder="Optional"
              className="rounded-lg border border-gray-300 bg-gray-100 text-black placeholder-gray-500 
                         focus:border-green-500 focus:ring-2 focus:ring-green-400"
            />
          </Form.Item>

          <Form.Item
            name="additionalComments"
            label={<span className="font-semibold text-black">Any additional comments?</span>}
          >
            <TextArea
              rows={3}
              placeholder="Optional"
              className="rounded-lg border border-gray-300 bg-gray-100 text-black placeholder-gray-500 
                         focus:border-green-500 focus:ring-2 focus:ring-green-400"
            />
          </Form.Item>
          {isView ?<></>:
          <Button
            type="primary"
            htmlType="submit"
            block
            className="bg-green-600 hover:bg-green-700 border-none font-bold py-2 rounded-lg"
          >
            Submit Feedback
          </Button>
}
        </Form>
      </div>

      <span className="absolute bottom-2 right-3 text-[10px] text-white opacity-15 select-none">
        Developed by Munees
      </span>
      <ToastContainer position="top-center" />
    </div>
  );
};
