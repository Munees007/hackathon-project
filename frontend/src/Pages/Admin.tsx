import { useEffect, useRef, useState } from "react";
import { fetchScoreData, getData, getFlag, getLevelsData, setFlag } from "../Database/functions/addData";
import { FormData } from "../Components/Form";
import { toast, ToastContainer } from "react-toastify";
import DisplayUsers from "../Components/DisplayUsers";
import { answerType, Level } from "../types/QuestionType";
import CreateQuestions from "../Components/CreateQuestions";
import ManageQuestions from "../Components/ManageQuestions";
import { BsPeopleFill } from "react-icons/bs";
import { RiDashboardFill, RiRegisteredFill, RiSettings5Fill } from "react-icons/ri";
import { IoMdCreate } from "react-icons/io";
import { BiUserCircle } from "react-icons/bi";
import { SiPhpmyadmin } from "react-icons/si";
import { GrScorecard } from "react-icons/gr";
import Score, { ScoreType } from "./Score";
import { useNavigate } from "react-router-dom";
import { MdFeedback, MdSettingsApplications } from "react-icons/md";
import { ViewFeedBack } from "../Components/ViewFeedBack";
import { General } from "../Components/General";
import { Registered } from "../Components/Registered";
import Sider from "antd/es/layout/Sider";
import { Menu } from "antd";

export interface userDataType {
  key: string;
  formData: FormData;
  codeData: answerType;
  Position: string
}
const Admin = () => {
  const [collapsed, setCollapsed] = useState(false); // for Ant Design collapsible sider

  const [userData, setUserData] = useState<userDataType[]>();
  const [levelData,setLevelData] = useState<Level[]>();
  const [scoreData,setScoreData] = useState<ScoreType[]>([]);
  const navigate = useNavigate();
  const userName = useRef<HTMLInputElement | null>(null);
  const passWord = useRef<HTMLInputElement | null>(null);
  const [verified, setverified] = useState<boolean>(() => {
    return Boolean(sessionStorage.getItem("adminVerified")) || false;
  });
  const [showPanels, setShowPanels] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const temp = await getData();
      const data = Object.entries(temp).map(([_, value]) => ({
        ...(value as userDataType),Position: (value as userDataType).Position ?? "P"
      }));
      setUserData(data);
      console.log(data);
        const getdata: Level[] = await getLevelsData();
        setLevelData(getdata);
      const score = await fetchScoreData();
      setScoreData(score);
    };
    fetchData();
  }, []);
  const [flag, setflag] = useState<boolean>();
  const handleFlag = async () => {
    setflag(!flag);
    await setFlag(!flag);
  };
  useEffect(() => {
    const fetchData = async () => {
      const flagdata = await getFlag();

      setflag(flagdata);
    };
    fetchData();
  }, []);
  const handleVerified = () => {
    const user = userName.current?.value;
    const pass = passWord.current?.value;
    if (user === "MW" && pass === "12345678") {
      setverified(!verified);
      sessionStorage.setItem("adminVerified", "true");
    } else {
      toast.error("Invalid Credentials");
    }
  };
  const handleShowPanels = (i: number) => {
    setShowPanels((e) => {
      const temp = [...e];
      temp[i] = true;
      for (let j = 0; j < temp.length; j++) {
        if (j != i) {
          temp[j] = false;
        }
      }
      return temp;
    });
  };
  return (
    <div className="flex flex-col bg-[#E5E5E5] font-Roboto h-screen overflow-hidden">
  {/* Top Bar */}
  {verified && (
    <div className="w-full h-14 bg-white flex items-center gap-2 font-extrabold text-[#2F80ED] text-2xl px-4 uppercase shadow-md">
      <BiUserCircle size={30} />
      <p>Admin</p>
    </div>
  )}

  {/* If not verified → Login Page */}
  {!verified ? (
    <div className="flex flex-1 justify-center items-center p-6">
      <div className="bg-[#2F80ED] flex w-[65rem] h-fit gap-2 p-3 border-2 border-white rounded-md shadow-lg">
        <div className="w-[50rem] flex justify-center items-center h-[35rem] rounded-md bg-[#2f81edaf] text-white">
          <SiPhpmyadmin size={200} />
        </div>
        <div className="flex flex-col w-[40rem] bg-white rounded-lg p-10 gap-4 justify-center items-center">
          <p className="font-extrabold text-3xl">Admin Login</p>
          <div className="w-full">
            <p className="text-xl font-semibold">User Name:</p>
            <input
              type="text"
              ref={userName}
              className="w-full text-2xl p-2 border-2 border-black rounded-md"
            />
          </div>
          <div className="w-full">
            <p className="text-xl font-semibold">Password:</p>
            <input
              type="password"
              ref={passWord}
              className="w-full text-2xl p-2 border-2 border-black rounded-md"
            />
          </div>
          <button
            type="button"
            className="text-xl h-14 w-full border-2 border-black rounded-md cursor-pointer hover:bg-[#2f81edaf] font-semibold bg-[#2F80ED] text-white"
            onClick={handleVerified}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  ) : (
    /* Admin Panel Layout */
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <Sider collapsible width={288} className="">
  <Menu
    mode="inline"
    style={{ height: "100%", borderRight: 0 }}
  >
    <Menu.Item key="6" icon={<MdSettingsApplications size={30} />} onClick={() => handleShowPanels(6)}>
      General
    </Menu.Item>
    <Menu.Item key="7" icon={<RiRegisteredFill size={30} />} onClick={() => handleShowPanels(7)}>
      Registered Students
    </Menu.Item>
    <Menu.Item key="0" icon={<BsPeopleFill size={30} />} onClick={() => handleShowPanels(0)}>
      Students
    </Menu.Item>
    <Menu.Item key="1" icon={<RiDashboardFill size={30} />} onClick={() => handleShowPanels(1)}>
      Dashboard
    </Menu.Item>
    <Menu.Item key="2" icon={<IoMdCreate size={30} />} onClick={() => handleShowPanels(2)}>
      Create
    </Menu.Item>
    <Menu.Item key="3" icon={<RiSettings5Fill size={30} />} onClick={() => handleShowPanels(3)}>
      Manage
    </Menu.Item>
    <Menu.Item key="4" icon={<GrScorecard size={30} />} onClick={() => handleShowPanels(4)}>
      Score
    </Menu.Item>
    <Menu.Item
      key="presentation"
      icon={<GrScorecard size={30} />}
      onClick={() => navigate("/present",{state:{score:scoreData}})}
    >
      Presentation
    </Menu.Item>
    <Menu.Item key="5" icon={<MdFeedback size={30} />} onClick={() => handleShowPanels(5)}>
      Feed Backs
    </Menu.Item>
  </Menu>
</Sider>

      {/* Main Content */}
      <div className="flex-1 p-5 overflow-auto">
        {showPanels[7] && (
          <div className="w-full bg-white p-5 rounded-lg shadow-md">
            <Registered/>
          </div>
        )}
        {showPanels[6] && (
          <div className="w-full bg-white p-5 rounded-lg shadow-md">
            <General/>
          </div>
        )}
        {showPanels[0] && (
          <div className="w-full bg-white p-5 rounded-lg shadow-md">
            <DisplayUsers
              flag={flag!}
              userData={userData!}
              levelData={levelData!}
              display={false}
              handleFlag={handleFlag}
            />
          </div>
        )}
        {showPanels[1] && (
          <div className="w-full bg-white p-10 rounded-lg shadow-md">
            <DisplayUsers
              flag={flag!}
              userData={userData!}
              levelData={levelData!}
              display={true}
              handleFlag={handleFlag}
            />
          </div>
        )}
        {showPanels[2] && (
          <div className="w-full bg-white p-5 rounded-lg shadow-md">
            <CreateQuestions />
          </div>
        )}
        {showPanels[3] && (
          <div className="w-full bg-white p-5 rounded-lg shadow-md">
            <ManageQuestions />
          </div>
        )}
        {showPanels[4] && (
          <div className="w-full bg-white p-5 rounded-lg shadow-md">
            <Score userData={userData!} levelData={levelData!} />
          </div>
        )}
        {showPanels[5] && (
          <div className="w-full bg-white p-5 rounded-lg shadow-md">
            <ViewFeedBack/>
          </div>
        )}
      </div>
    </div>
  )}
  <ToastContainer position="top-center" />
</div>

  );
};

export default Admin;
