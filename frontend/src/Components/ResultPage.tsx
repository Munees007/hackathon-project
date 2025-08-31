import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import winner_bg from "../assets/winner-bg.jpg";
import { ScoreType } from "../Pages/Score";
import Lottie from "lottie-react";
import medal from "../assets/animations/Trophy.json";
const ResultDisplay = ({ data }: { data: ScoreType[] }) => {
  const containerRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(0); // 0 = college, 1 = event name, 2 = winners
  const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0); // Track which winner to display

  // Sort winners in order 3rd → 2nd → 1st
  const winners:ScoreType[] = []

  winners.push(data.find((d)=> d.Position === "III")!)
  winners.push(data.find((d)=> d.Position === "II")!)
  winners.push(data.find((d)=> d.Position === "I")!)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNavigation("next");
      if (e.key === "ArrowLeft") handleNavigation("prev");
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [currentStep, currentWinnerIndex]);

  const handleNavigation = (direction: "next" | "prev") => {
    if (direction === "next") {
      if (currentStep === 0) {
        setCurrentStep(1); // Show event name
      } else if (currentStep === 1) {
        setCurrentStep(2);
        setCurrentWinnerIndex(0); // Start with 3rd prize
      } else if (currentStep === 2) {
        if (currentWinnerIndex < winners.length - 1) {
          setCurrentWinnerIndex(currentWinnerIndex + 1); // Next winner
        } else {
          setCurrentStep(2);
        setCurrentWinnerIndex(0); // Start with 3rd prize
        }
      }
    }

    if (direction === "prev") {
      if (currentStep === 2) {
        if (currentWinnerIndex > 0) {
          setCurrentWinnerIndex(currentWinnerIndex - 1);
        } else {
          setCurrentStep(1); // Go back to event name
        }
      } else if (currentStep === 1) {
        setCurrentStep(0); // Go back to college slide
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-screen absolute top-0 left-0 bg-cover bg-center flex flex-col justify-center items-center text-white"
      style={{ backgroundImage: `url(${winner_bg})` }}
    >
      {/* Step 0: College Info */}
      {currentStep === 0 && (
        <motion.div
          key="college"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="text-center uppercase"
        >
          <p className="text-4xl md:text-5xl font-bold">
            Ayya Nadar Janaki Ammal College Sivakasi
          </p>
          <p className="text-3xl md:text-4xl font-bold mt-2">
            Department of Computer Applications
          </p>
          <p className="text-3xl md:text-4xl font-bold mt-2">Hackathon 2k25</p>
        </motion.div>
      )}

      {/* Step 1: Event Name */}
      {currentStep === 1 && (
        <motion.div
          key="event"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-8xl font-bold">Hackathon</h1>
        </motion.div>
      )}

      {/* Step 2: Winners */}
      {currentStep === 2 && (
        <AnimatePresence>
          <Lottie
          className="w-96"
          animationData={medal} loop={true}
          ></Lottie>
          <motion.div
            key={`winner-${currentWinnerIndex}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center bg-black/70 p-6 rounded-lg font-Roboto shadow-lg w-4/5 md:w-3/5 lg:w-2/5 xl:w-1/3"
          >
            <h2 className="text-4xl font-bold text-yellow-400">
              {winners[currentWinnerIndex]?.Position} Prize
            </h2>
            <p className="text-2xl mt-4 text-white">
              Name: {winners[currentWinnerIndex]?.FormData?.name}
            </p>
            <p className="text-2xl mt-2 text-white">
              {winners[currentWinnerIndex]?.FormData?.rollNumber}
            </p>
            <div className="flex flex-col gap-2 mt-4 text-xl">
              {winners[currentWinnerIndex]?.FormData?.className}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default ResultDisplay;
