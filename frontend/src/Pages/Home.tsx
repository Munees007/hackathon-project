import { useEffect, useState } from "react";
import MatrixEffect from "../Components/MatrixEffect";
import {enterFullScreen} from "../Functions/FullScreen"
import { useNavigate } from "react-router-dom";
import Form from "../Components/Form";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { getFlag, getTime } from "../Database/functions/addData";
import "../../public/assets/images/Bg1.jpg"
import RulesCard from "../Components/RulesCard";

const Home = () =>{
    const [currentImg, setCurrentImg] = useState<string>("Bg1.jpg");
    const [formSubmitted,setFormSubmitted] = useState<boolean>(()=>{
        const temp = localStorage.getItem("formSubmitted");
    
        return temp ? Boolean(temp) : false;
      })


    const backGround = ["Bg1.jpg", "bg2.png"];
    const navigate =  useNavigate();
    const dateObj = new Date();
    const fetchTime = async () => {
    const time = await getTime();
    console.log("Fetched time from DB:", time);

    try {
      const finalTime = JSON.stringify(time)
      localStorage.setItem("dbTime", finalTime);
      console.log("Stored dbTime in localStorage:", finalTime);
    } catch (err) {
      console.error("Failed to set localStorage:", err);
    }
  };

useEffect(() => {
  
  fetchTime();
}, [navigate]);

    useEffect(()=>{
        enterFullScreen(document.location.pathname);
    },[])
    const handleImageChange = (direction: "next" | "prev") => {
      const currentIndex = backGround.indexOf(currentImg);
      const nextIndex = direction === "next" ? (currentIndex + 1) % backGround.length : (currentIndex - 1 + backGround.length) % backGround.length;
      setCurrentImg(backGround[nextIndex]);
  };
    const handleChangeRoute = async () =>{
      const temp = localStorage.getItem("formSubmitted");
      const date = localStorage.getItem("date");

      if(date === dateObj.toLocaleDateString())
      {
        if(!temp)
          {
            navigate('/');
          }
          else{
             const flag = await getFlag();
  
             if(flag === true)
             {
                navigate('/codespace')
             }
          }
      }
      else
      {
        Object.keys(localStorage).forEach((key) => {
    if (key !== "dbTime" && !key.includes("firebase")) {
      localStorage.removeItem(key);
    }
  });

        localStorage.setItem("date",dateObj.toLocaleDateString());
      }
    }
    useEffect(()=>{
        const handleInterval =  setInterval(()=>{
          handleChangeRoute();
      },3000)
      return ()=> clearInterval(handleInterval)
    },[navigate])
    return (
      <div className={`relative w-full h-screen `}>
        
        <img src={`${import.meta.env.BASE_URL}assets/images/${currentImg}`} className="w-full h-full"></img>
        {backGround.indexOf(currentImg) === 1 && (
          <div className={`absolute bg-black/60 inset-0 flex items-center justify-center `}>
            {formSubmitted ? <RulesCard/> : <Form Submitted={(e)=> {
              if(e){
                toast.success("Form Submitted");
              }
              else
              {
                toast.error("Form Submit Failed");
              }
              setTimeout(() => setFormSubmitted(e), 2000); }}/>} 
         
          </div>
        )}
        
        {
          backGround.indexOf(currentImg) === 0 &&<div className="absolute w-full h-screen top-80 left-0">
          <div className="flex w-full h-screen justify-center items-center">
             <button onClick={()=>handleImageChange('next')} className="bg-green-500 font-bold uppercase tracking-wider hover:scale-105 active:95 hover:bg-green-400 animate-pulse w-fit border-2 border-white rounded-md shadow-lg shadow-black h-fit px-10 py-3 font-Orbiton text-2xl ">Register</button>
          </div>
        </div>
}         
        {/* <img src="./src/assets/images/btn.png" title="Start" onClick={handleChangeRoute} className="absolute bottom-5 right-8 w-32 hover:scale-110 cursor-pointer active:scale-90"></img> */}
        <MatrixEffect/>
      </div>
    );
}

export default Home;