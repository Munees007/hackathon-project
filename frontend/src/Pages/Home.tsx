import { useEffect, useRef, useState } from "react";
import MatrixEffect from "../Components/MatrixEffect";
import { enterFullScreen } from "../Functions/FullScreen";
import { useNavigate } from "react-router-dom";
import Form from "../Components/Form";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { getFlag, getTime } from "../Database/functions/addData";
import "../../public/assets/images/Bg1.jpg";
import RulesCard from "../Components/RulesCard";
import { motion ,AnimatePresence} from "framer-motion";
import { LetterJumpText } from "../Components/LetterJumpText";
import flexi from "../assets/animations/Flexi.json";
import Lottie from "lottie-react";
const Home = () => {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(() => {
    const temp = localStorage.getItem("formSubmitted");

    return temp ? Boolean(temp) : false;
  });
  const [showLogin,setShowLogin] = useState<boolean>(true)
  const navigate = useNavigate();
  const dateObj = new Date();
  const fetchTime = async () => {
    const time = await getTime();
    console.log("Fetched time from DB:", time);

    try {
      const finalTime = JSON.stringify(time);
      localStorage.setItem("dbTime", finalTime);
      console.log("Stored dbTime in localStorage:", finalTime);
    } catch (err) {
      console.error("Failed to set localStorage:", err);
    }
  };

  useEffect(() => {
    fetchTime();
  }, [navigate]);

  useEffect(() => {
    enterFullScreen(document.location.pathname);
  }, []);
  const handleChangeRoute = async () => {
    const temp = localStorage.getItem("formSubmitted");
    const date = localStorage.getItem("date");

    if (date === dateObj.toLocaleDateString()) {
      if (!temp) {
        navigate("/");
      } else {
        const flag = await getFlag();

        if (flag === true) {
          navigate("/brain_spark");
        }
      }
    } else {
      Object.keys(localStorage).forEach((key) => {
        if (key !== "dbTime" && !key.includes("firebase")) {
          localStorage.removeItem(key);
        }
      });
      localStorage.setItem("formSubmitted","false");
      localStorage.setItem("date", dateObj.toLocaleDateString());
    }
  };
  useEffect(() => {
    const handleInterval = setInterval(() => {
      handleChangeRoute();
    }, 3000);
    return () => clearInterval(handleInterval);
  }, [navigate]);
  return (
    <div className="relative min-h-screen w-full bg-[#020617] overflow-hidden">
      <motion.div
        ref={gridRef}
        className="absolute inset-0 z-0"
        style={{
          background: "#020617",
          backgroundImage: `
            linear-gradient(to right, rgba(100,116,139,0.25) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(100,116,139,0.25) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
        animate={{
          backgroundPositionY: ["0px", "-40px"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-between p-6 space-y-16">
        <div className="flex flex-col items-center gap-5">
        <LetterJumpText
          text="Zynova 2K25"
          className="text-6xl font-extrabold max-sm:text-4xl text-cyan-400"
        />
        <p className="text-lg md:text-xl text-white">
            Enter the Codeverse. Create Your Reality.
          </p>
          </div>
          {
            showLogin && <Lottie animationData={flexi} loop={true}/>
          }
        <div className="w-full h-screen top-0 absolute flex justify-center items-center">
          <AnimatePresence>
        {!showLogin && ( formSubmitted ? (
          <RulesCard />
        ) : (
          <Form
            Submitted={(e) => {
              if (e) {
                toast.success("Form Submitted");
              } else {
                toast.error("Form Submit Failed");
              }
              setTimeout(() => setFormSubmitted(e), 2000);
            }}
            closeForm={()=>{
              setShowLogin(true)
            }}
          />
        ))}
        </AnimatePresence>
</div>
        {showLogin && (
          <button
            onClick={() => setShowLogin(false)}
            className="bg-[#48cae4] font-bold uppercase tracking-wider hover:scale-105 active:95 hover:bg-white/50 animate-pulse w-fit border-2 border-white rounded-md shadow-lg shadow-black h-fit px-10 py-3 font-Orbiton text-2xl "
          >
            Login
          </button>
        )}
      </div>

      {/* <img src="./src/assets/images/btn.png" title="Start" onClick={handleChangeRoute} className="absolute bottom-5 right-8 w-32 hover:scale-110 cursor-pointer active:scale-90"></img> */}
      <MatrixEffect />
    </div>
  );
};

export default Home;
