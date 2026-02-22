import { useEffect, useState } from "react";
import { Spin, message } from "antd";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { app } from "../Database/firebase";
import {motion} from "framer-motion"
import { LetterJumpText } from "../Components/LetterJumpText";
export const Flag = () => {
  const [flag, setFlagState] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const db = getDatabase(app);
  const flagRef = ref(db, "flag");

  useEffect(() => {
    const unsubscribe = onValue(flagRef, (snapshot) => {
      const data = snapshot.val();
      setFlagState(data ?? false);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleFlag = async () => {
    try {
      setLoading(true);
      await set(flagRef, !flag);
      message.success(`Event ${!flag ? "Started" : "Stopped"} Successfully`);
    } catch (error) {
      console.error("Error updating flag:", error);
      message.error("Failed to update event status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#020617] overflow-hidden">

  {/* Animated Grid Background */}
  <motion.div
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

  {/* Main Content */}
  <div className="relative z-20 min-h-screen flex flex-col justify-center items-center p-6">

    {/* Top Right Status */}
    <div className="absolute top-6 right-6">
      <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
        <span className="relative flex h-4 w-4">
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
              flag ? "bg-red-500" : "bg-gray-400"
            }`}
          ></span>
          <span
            className={`relative inline-flex rounded-full h-4 w-4 ${
              flag ? "bg-red-500" : "bg-gray-400"
            }`}
          ></span>
        </span>

        <span className="text-white font-semibold text-sm tracking-wide">
          {flag ? "Live Now" : "Not Live"}
        </span>
      </div>
    </div>

    {/* Center Content */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center gap-8"
    >
      <LetterJumpText
                text="Zynova 2K26"
                className="text-6xl font-extrabold max-sm:text-4xl text-cyan-400"
              />
      {/* Title */}
      <h1 className="text-5xl font-extrabold text-cyan-400 tracking-wide">
        Event Control
      </h1>

      {/* Button / Loader */}
      {loading ? (
        <Spin size="large" />
      ) : (
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleFlag}
          className={`w-56 py-5 text-xl rounded-xl shadow-2xl
            transition-all duration-300 font-bold tracking-wide
            ${
              flag
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }
          `}
        >
          {flag ? "Stop Event" : "Start Event"}
        </motion.button>
      )}
    </motion.div>

    {/* Subtle watermark */}
    <span className="absolute bottom-4 right-6 text-xs text-white opacity-20 select-none pointer-events-none">
      Developed by Munees
    </span>
  </div>
</div>
  );
};
