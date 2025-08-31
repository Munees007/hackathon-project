import { useEffect } from "react";
import "../Modules/themes"
import { useNavigate } from "react-router-dom";

const ThankYou = ()=>{
    const navigate = useNavigate();
    useEffect(()=>{
        const gameOver = localStorage.getItem("gameover");
        if(gameOver === "false")
            {
                navigate('/codespace');
            }
    },[navigate])
    return(
        <div className="flex flex-col items-center  justify-center min-h-screen p-4 bg-gradient-to-r from-cyan-500 to-blue-500">
        <div className="backdrop-blur-md bg-white/20 p-6 rounded-lg shadow-lg shadow-black relative w-[42rem]">
  <h2 className="text-2xl font-semibold mb-4 font-Orbiton">Special Thanks To!</h2>
  <p className="mb-4 text-justify text-xl font-Roboto">
    We would like to sincerely thank all the <b>participants</b> for your active involvement, enthusiasm, and dedication that brought life to this event.
  </p>
  <p className="mb-4 text-justify text-xl font-Roboto">
    Our heartfelt gratitude goes to the <b>Department of Computer Applications</b> for their constant encouragement and support in making this event a success.
  </p>
  <p className="mb-4 text-justify text-xl font-Roboto">
    A special appreciation to all the <b>volunteers</b> whose hard work and commitment ensured everything ran smoothly from start to finish.
  </p>
  <p className="mb-4 text-justify text-xl font-Roboto">
    Together, your contributions have made this event truly memorable and inspiring for everyone involved.
  </p>
</div>

      </div>
    )
}

export default ThankYou;