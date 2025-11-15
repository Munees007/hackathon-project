import { useEffect, useState } from "react";
import { FeedbackType } from "../types/QuestionType";
import { getFeedbacks } from "../Database/functions/addData";
import { toast} from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { Modal, Table } from "antd";
import { FeedBack } from "../Pages/FeedBack";
export const ViewFeedBack = () =>{
    const [feedBacks,setFeedBacks] = useState<FeedbackType[]>([]);
    const [currentFeedback,setCurrentFeedback] = useState<FeedbackType | null>(null);
    const [isModalOpen,setIsModalOpen] = useState<boolean>(false);
    const handleOk = () =>{
        setIsModalOpen(false);
        setCurrentFeedback(null);
    }
    const feedBackTableData = [
        {
            title:"S.No",
            dataIndex:"sno",
            key:"sno",
            render: (_:any, __:any, index:number) => (
                <span>{index+1}</span>
              ),
        },
        {
            title:"Roll Number",
            dataIndex:"rollNumber",
            key:"rollNumber",
            render: (_:any, record:any) => (
                <a onClick={()=>{setCurrentFeedback(record);setIsModalOpen(true)}}>{record.user.rollNumber}</a>
              ),  
        },
        {
            title:"Name",
            dataIndex:"name",
            key:"name",
            render: (_:any, record:any) => (
                <span>{record.user.name}</span>
              ),
        },
        {
            title:"Class",
            dataIndex:"className",
            key:"className",
            render: (_:any, record:any) => (
                <span>{record.user.className}</span>
              ),
        },
        {
            title:"Email",
            dataIndex:"email",
            key:"email",
            render: (_:any, record:any) => (
                <span>{record.user.email}</span>
                ),
        }
    ]
    useEffect(()=>{
        const fetchFeedBacks = async()=>{
            try
            {
                const res = await getFeedbacks();
                setFeedBacks(res);
                console.log(res);
                toast.success("Feedbacks fetched successfully");
            }
            catch(e)
            {
                toast.error("Error in fetching feedbacks");
                console.log(e);
            }
        }
        fetchFeedBacks();
    },[])
    return(
        <div>
            <h1 className="text-2xl font-bold mb-4">Feedbacks</h1>
            <Table columns={feedBackTableData} dataSource={feedBacks}></Table>

            <Modal
                title="Feedback Details"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleOk}
                width={800}
                footer={null}
            >
                <FeedBack isView={true} feedBackData={currentFeedback!}></FeedBack>
            </Modal>
        </div>
    );
}