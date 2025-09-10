import { useEffect, useState } from "react"
import { getRegistrations } from "../Database/functions/addData"
import { Table, Tooltip } from "antd";

export interface RegistrationInterface {
  className: string;
  college: string;
  email: string;
  mobile: string;
  paymentInfo: {
    amountPaid: string;
    paymentFrom: string;
    paymentMode: string;
    paymentTimestamp: number;
  };
  teamMembers: {
    Participant1: string;
    Participant2: string;
    RollNo1: string;
    RollNo2: string;
  };
  timestamp: number;
}
export const Registered = () =>{
    const [registrations, setRegistrations] = useState<RegistrationInterface[]>([]);

    const columns = [
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Mobile",
    dataIndex: "mobile",
    key: "mobile",
  },
  {
    title: "Team Members",
    key: "teamMembers",
    render: (text: any, record: RegistrationInterface) => (
      <Tooltip
        title={
          <div>
            <div>
              {record.teamMembers.Participant1} ({record.teamMembers.RollNo1})
            </div>
            <div>
              {record.teamMembers.Participant2} ({record.teamMembers.RollNo2})
            </div>
          </div>
        }
      >
        <span>
          {record.teamMembers.Participant1} & {record.teamMembers.Participant2}
        </span>
      </Tooltip>
    ),
  },
  {
    title: "College",
    dataIndex: "college",
    key: "college",
  },
  {
    title: "Class",
    dataIndex: "className",
    key: "className",
  },
  {
    title: "Payment Status",
    key: "paymentInfo",
    render: (text: any, record: RegistrationInterface) => (
      <Tooltip
        title={
          <div>
            <div>Amount: {record.paymentInfo.amountPaid}</div>
            <div>Mode: {record.paymentInfo.paymentMode}</div>
            <div>From: {record.paymentInfo.paymentFrom || "N/A"}</div>
          </div>
        }
      >
        <span>{record.paymentInfo.amountPaid}</span>
      </Tooltip>
    ),
  },
];

    useEffect(()=>{
        const fetchData = async()=>{
            // fetch registered data from database and display it here
            let data = await getRegistrations();
            setRegistrations(data as RegistrationInterface[]);
        }
        fetchData();
    },[])
    return (
        <div>
            <Table columns={columns} dataSource={registrations} rowKey={(record) => record.email} loading={registrations.length === 0}/> 
        </div>
    )
}