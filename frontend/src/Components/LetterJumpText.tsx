import type React from "react";
import { useEffect, useRef, useState } from "react";

interface LetterJumpTextProps {
  text: string;
  className: string;
}
export const LetterJumpText: React.FC<LetterJumpTextProps> = ({
  text,
  className,
}) => {
  const refs = useRef<HTMLSpanElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  useEffect(() => {
    const manageAnimation = () => {
      if (text[currentIndex] === " ") {
        return;
      }
      refs.current[currentIndex].className = "scale-down";
    };
    manageAnimation();
    const timer = setInterval(() => {
      refs.current[currentIndex].className = "";
      if (currentIndex == text.length - 1) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex((e) => e + 1);
      }
    }, 400);

    return () => {
      clearInterval(timer);
    };
  }, [currentIndex]);
  return (
    <p
      style={{
        textShadow: `
            2px 2px 0 #0ff,
            0 0 20px #0ff,
            0 0 40px #0ff,
            0 0 60px #0ff
          `,
        perspective: "800px",
      }}
      className={`text-center relative  uppercase ${className} font-[Orbitron] tracking-[0.8rem] font-bold`}
    >
      {text.split("").map((c, index) => {
        return (
          <span
            key={index}
            ref={(el) => {
              if (el) refs.current[index] = el;
            }}
          >
            {c}
          </span>
        );
      })}
    </p>
  );
};
