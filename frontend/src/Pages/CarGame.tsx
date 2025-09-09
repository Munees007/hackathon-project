import { useState, useEffect, useRef } from "react";

export const CarGame = () => {
  const roadRef = useRef<HTMLDivElement>(null);
  const [lanes, setLanes] = useState<number[]>([]);
  const [currentLane, setCurrentLane] = useState(1); // center lane

  // Calculate lanes dynamically based on road width
  useEffect(() => {
    const calculateLanes = () => {
      if (roadRef.current) {
        const roadWidth = roadRef.current.clientWidth;
        const laneCount = 3; // you can increase lanes
        const laneWidth = roadWidth / laneCount;

        const positions = Array.from({ length: laneCount }, (_, i) => (i + 0.5) * laneWidth);
        setLanes(positions);
      }
    };

    calculateLanes();
    window.addEventListener("resize", calculateLanes);
    return () => window.removeEventListener("resize", calculateLanes);
  }, []);

  // Handle arrow key movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentLane > 0) setCurrentLane(currentLane - 1);
      if (e.key === "ArrowRight" && currentLane < lanes.length - 1) setCurrentLane(currentLane + 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentLane, lanes.length]);

  return (
    <div
      ref={roadRef}
      className="w-full h-screen flex justify-center bg-[#666666] relative overflow-hidden"
    >
      {/* Background */}
      <img
        src={`${import.meta.env.BASE_URL}assets/images/carbg.png`}
        className="h-screen w-full object-cover"
      />

      {/* Car */}
      {lanes.length > 0 && (
        <img
          src={`${import.meta.env.BASE_URL}assets/images/car.png`}
          className="absolute bottom-10 transition-left duration-150"
          style={{ left: lanes[currentLane], transform: "translateX(-50%)" }}
          alt="player-car"
        />
      )}
    </div>
  );
};
