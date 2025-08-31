import { useEffect, useState } from "react";
import { Button, Spin, message } from "antd";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { app } from "../Database/firebase";

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
    <div
      style={{ backgroundImage: `url('assets/images/Bg1.jpg')` }}
      className="relative min-h-screen flex flex-col justify-center items-center p-4"
    >
      {/* Top Right Status */}
      <div className="absolute top-0 right-0 p-4">
        <div className="flex items-center gap-2 mt-4">
          <span className="relative flex h-4 w-4">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                flag ? "bg-red-500" : "bg-gray-300"
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-4 w-4 ${
                flag ? "bg-red-500" : "bg-gray-300"
              }`}
            ></span>
          </span>
          <span className="text-white font-medium text-sm">
            {flag ? "Live Now" : "Not Live"}
          </span>
        </div>
      </div>
      {/* Centered Button */}
      {loading ? (
        <Spin size="large" />
      ) : (
        <Button
          size="large"
          onClick={toggleFlag}
          className={`w-40 mt-[35rem] py-6 text-lg sm:text-xl rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 font-semibold ${
            flag
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {flag ? "Stop Event" : "Start Event"}
        </Button>
      )}

      {/* Subtle watermark */}
      <span className="absolute bottom-2 right-3 text-[10px] text-white opacity-20 select-none pointer-events-none">
        Developed by Munees
      </span>
    </div>
  );
};
