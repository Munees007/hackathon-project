import AceEditor from "react-ace";
import "../Modules/language";
import "../Modules/themes";
import React, { useEffect, useState } from "react";
import DropDown from "./DropDown";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { VscCheck, VscPlay } from "react-icons/vsc";
import Lottie from "lottie-react";
import loading from "../assets/animations/loading.json";
import empty from "../assets/animations/codeStart.json";
import timerAni from "../assets/animations/timer1.json";
import { useNavigate } from "react-router-dom";
import { answerLevel, answerType, Level, testCaseResult } from "../types/QuestionType";
import { addCodeData } from "../Database/functions/addData";
import { useTestCaseExecutor } from "../Components/useTestCaseExecuter";
import { TestCase } from "./TestCase";
export const getCurrentLevelIndex = () => {
  const temp: number = parseInt(localStorage.getItem("LevelIndicator")!) || 0;
  return temp;
};
interface EditorProps {
  questionNo: number;
  clearOutput: () => void;
  currentLevel: Level;
  increaseLevel: () => void;
  showLoading:(a:boolean)=>void;
  useLevel: boolean;
  levelIndex: number;
}
export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};
const codeDataToDB = async () => {
  const data = localStorage.getItem("codeData");

  if (data) {
    await addCodeData(JSON.parse(data));
  }
  else
  {
    
  }
};
const Editor: React.FC<EditorProps> = ({
  useLevel,
  levelIndex,
  questionNo,
  clearOutput,
  currentLevel,
  increaseLevel,
  showLoading
}) => {
  const [code, setCode] = useState<string>(() => {
    if (useLevel) {
      const key = `Level${getCurrentLevelIndex()}Question${questionNo}language`;
      const value = localStorage.getItem(key);
      return (
        localStorage.getItem(`Level${levelIndex}Question${questionNo}LanguageCode${value}`) || ""
      );
    } else {
      
      const key = `Level${getCurrentLevelIndex()}Question${questionNo}language`;
      const value = localStorage.getItem(key);
      return (
        localStorage.getItem(
          `Level${getCurrentLevelIndex()}Question${questionNo}LanguageCode${value}`
        ) || ""
      );
    }
  });
  const navigate = useNavigate();
  const [Result, setResult] = useState<testCaseResult | null>(null);
  const [timerRunning, setTimerRunning] = useState<boolean>(true);
  const { ExecuteTestCases, iFrameRef } = useTestCaseExecutor();
  const [gameOver, setGameOver] = useState<boolean>(() => {
    const temp: boolean = Boolean(localStorage.getItem("gameover")) || false;
    return temp;
  });
  const [codeData, setCodeData] = useState<answerType | null>(() => {
    const temp = localStorage.getItem("codeData");
    if (temp) {
      return JSON.parse(temp);
    } else {
      return null;
    }
  });
  useEffect(() => {
    const temp = localStorage.getItem("gameover") || "false";
    const timer = localStorage.getItem("timer") || (60*40).toString();
    if (temp !== "false" || timer === "0") {
      navigate("/thankYou");
    }
  }, [navigate]);
  const [levelIncrease, setLevelIncrease] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(() => {
    const temp = localStorage.getItem("timer");
    if (temp) {
      return parseInt(temp);
    } else {
      const dbTime = localStorage.getItem("dbTime");
      localStorage.setItem("timer", dbTime ? dbTime : (60 * 40).toString());
      return dbTime ? parseInt(dbTime) : 60 * 40; // time in seconds
    }
  });
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(() => {
    const temp: number = parseInt(localStorage.getItem("LevelIndicator")!) || 0;
    return temp;
  });
  //const [canSubmit,setCanSubmit] = useState<boolean>(false);
  const [theme, SetTheme] = useState<string>(() => {
    return localStorage.getItem("theme") || "dracula";
  });
  const [language, SetLanguage] = useState<number>(() => {
    const key = `Level${getCurrentLevelIndex()}Question${questionNo}language`;
    const value = localStorage.getItem(key);
    return parseInt(value ?? "71", 10);
  });

  const [showResult, setShowResult] = useState<boolean>(true);
  const runCode = async () => {
    showLoading(true);
    if (code !== "") {
      setResult({
        output: "Compiling",
        sucess: false,
        testCase: [],
        testCaseFailed: 0,
        testCaseSucceded: 0,
      });
      const correctAnswer =
        currentLevel.questions[questionNo - 1].content.testCase;
        
      await ExecuteTestCases(currentLevel, questionNo, code, language).then(
        (Result) => {
          if (!Result) {
            showLoading(false);
            return;
          }
          setResult(Result);
          if (
            Result.testCaseFailed == 0 &&
            Result.testCaseSucceded === correctAnswer.length
          ) {
            save();
            toast.success("Executed Successfully");
          }
        }
      );
    } else {
      toast.error("Type something");
    }
    showLoading(false);
  };
  const [breakTime, setBreakTime] = useState<number>(() => {
    const temp = localStorage.getItem("breakTime");
    if (temp) {
      return parseInt(temp);
    } else {
      localStorage.setItem("breakTime", (60 * 0).toString());
      return 60 * 0;
    }
  });
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  const formatBreakTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds}`;
  };
  const [breakTimer, setBreakTimer] = useState<boolean>(() => {
    const temp = localStorage.getItem("breakTimer");
    if (temp === "true") {
      return true;
    } else {
      localStorage.setItem("breakTimer", "false");
      return false;
    }
  });
  useEffect(() => {
    if (!breakTimer) return;
    let handleBreakTimer: NodeJS.Timeout;
    handleBreakTimer = setInterval(() => {
      setBreakTime((preValue) => preValue - 1);
      localStorage.setItem("breakTime", breakTime.toString());
    }, 1000);
    if (breakTime <= 0) {
      localStorage.setItem("breakTime", "0");
      localStorage.setItem("breakTimer", "false");
      setTimer(timer - 2);
      localStorage.setItem("timer", (timer - 2).toString());
      setTimerRunning(true);
      setBreakTimer(false);
    }

    return () => clearInterval(handleBreakTimer);
  }, [breakTimer, breakTime]);


  useEffect(()=>{
      const shortCuts = (e: KeyboardEvent) => {
        if(e.altKey && e.ctrlKey && e.shiftKey && e.key === "m")
        {
          e.preventDefault();
          handleTimeUp();
        }
        if(e.altKey && e.key === "r") {
          e.preventDefault();
          runCode();
        }
        if(e.altKey && e.key === "s")
        {
          e.preventDefault();
          handleSubmit();
        }
        if(e.altKey && e.key === "n")
        {
            setShowResult((prev)=> !prev);
        }
      }
      document.addEventListener("keydown", shortCuts);
      return () => {
        document.removeEventListener("keydown", shortCuts);
      }
  },[])
  useEffect(()=>{
    if(language) save();
  },[code])
  const handleDatasubmit = async () => {
    await increaseLevel();
    const temp = parseInt(localStorage.getItem("MaxLength")!);
    if (getCurrentLevelIndex() < temp) {
      setCurrentLevelIndex(getCurrentLevelIndex());
    }
    setLevelIncrease(false);
    setCode("");
    handleLanguage(71);
  };
  const handleTimeUp = async () => {
  showLoading(true);

  const levels: Level[] = JSON.parse(localStorage.getItem("UselevelData")!);
  const ansLevel: answerLevel[] = [];

  for (const data of levels) {
    // Run all questions in parallel for this level
    const answers = await Promise.all(
      data.questions.map(async (_, Qno) => {
        const keyPrefix = `${Qno + 1}`;
        const key = `Level${data.levelIndex!}Question${Qno + 1}language`;
        const value = localStorage.getItem(key);
        const Resultkey = `Level${data.levelIndex!}Question${Qno + 1}LanguageCode${value}Result`;

        let testResult: testCaseResult = JSON.parse(localStorage.getItem(Resultkey) || "{}");

        if (!testResult || Object.keys(testResult).length === 0) {
          const code =
            localStorage.getItem(
              `Level${data.levelIndex}Question${Qno + 1}LanguageCode${value}`
            ) || "";
          const lC =
            localStorage.getItem(
              `Level${data.levelIndex!}Question${keyPrefix}language`
            ) || "71";
          const IntLC = parseInt(lC);

          testResult = await ExecuteTestCases(data, Qno + 1, code, IntLC) as testCaseResult;
        }

        return {
          code:
            localStorage.getItem(
              `Level${data.levelIndex}Question${Qno + 1}LanguageCode${value}`
            ) || "",
          language:
            localStorage.getItem(
              `Level${data.levelIndex!}Question${keyPrefix}language`
            ) || "71",
          answered:
            Boolean(
              localStorage.getItem(
                `Level${data.levelIndex!}question${keyPrefix}answered`
              )
            ) || false,
          testCaseResult: testResult,
          questionNo: Qno + 1,
          levelIndex: data.levelIndex!,
        };
      })
    );

    // compute score after collecting results (safe, no race condition)
    const score = answers.reduce((acc, ans) => acc + (ans.testCaseResult?.sucess ? 1 : 0), 0);

    ansLevel.push({ answer: answers, score });
  }

  const timeUpAnswer: answerType = { finalAnswer: ansLevel, timeLeft: 0 };
  localStorage.setItem("codeData", JSON.stringify(timeUpAnswer));

  // ✅ wait for DB save before navigating
  await codeDataToDB();

  setTimer(0);
  setTimerRunning(false);
  setGameOver(true);
  localStorage.setItem("timer", "0");
  localStorage.setItem("gameover", "true");

  showLoading(false);
  navigate("/feedback");
};

  useEffect(() => {
    if (!timerRunning) return;
    if (!timerRunning && gameOver) return;
    const handleTimer = setInterval(() => {
      setTimer((preValue) => preValue - 1);
      localStorage.setItem("timer", timer.toString());
    }, 1000);

    if (timer === 0) {
      handleTimeUp();
      
    }

    if (timer === 5400) {
      localStorage.setItem("breakTimer", "true");
      setTimerRunning(false);
      setBreakTimer(true);
    }

    if (currentLevel?.questions?.length === getScore()) {
      setLevelIncrease(true);
    }
    return () => clearInterval(handleTimer);
  }, [timer, timerRunning, gameOver, currentLevelIndex]);

  const getScore = (): number => {
    const currentLevel = parseInt(localStorage.getItem("LevelIndicator")!) || 0;
    if (
      codeData &&
      codeData.finalAnswer &&
      codeData.finalAnswer[currentLevel]
    ) {
      return codeData.finalAnswer[currentLevel].score || 0;
    }

    return 0; // Return 0 if any of the checks fail
  };

  useEffect(() => {
    const gameover = localStorage.getItem("gameover");

    if (gameover === "true") {
      codeDataToDB()
      navigate("/feedback");
    }
  }, [gameOver]);
  const themes = [
    { label: "Twilight", value: "twilight" },
    { label: "Clouds", value: "clouds" },
    { label: "Dawn", value: "dawn" },
    { label: "Dracula", value: "dracula" },
    { label: "Ambiance", value: "ambiance" },
    { label: "DreamWeaver", value: "dreamweaver" },
    { label: "Chaos", value: "chaos" },
    { label: "Cobalt", value: "cobalt" },
    { label: "Eclipse", value: "eclipse" },
    { label: "GruvBox", value: "gruvbox" },
    { label: "Gob", value: "gob" },
    { label: "Monokai", value: "monokai" },
  ];
  const languages = [
    { label: "Cpp", value: 54,mode:"c_ccp",lang:"cpp" },
    { label: "Java", value: 62,mode:"java",lang:"java" },
    { label: "Python", value: 71,mode:"python",lang:"python" },
  ];

  const handleTheme = (value: string) => {
    SetTheme(value);
    localStorage.setItem("theme", value);
  };
  const handleLanguage = (value: number) => {
    value = parseInt(value.toString());
    SetLanguage(value);
    localStorage.setItem(
      "Level" +
        getCurrentLevelIndex() +
        "Question" +
        questionNo.toString() +
        "language",
      value.toString()
    );
    const codeThere = `Level${getCurrentLevelIndex()}Question${questionNo}LanguageCode${value}`;
    if(localStorage.getItem(codeThere)) {
      setCode(localStorage.getItem(codeThere) || "");
      return;
    }
    
    const key = `Level${getCurrentLevelIndex()}Question${questionNo}LanguageCode${value}`;
    const templateCode = currentLevel.questions[questionNo - 1].content.boilerCode?.find(
        (b) => b.languageCode == value
      )?.funtionSignature || "";
    localStorage.setItem(key,templateCode);
    setCode(
      templateCode
    );
  };
  useEffect(()=>{
    const key = "Level" + getCurrentLevelIndex() + "Question" + questionNo.toString() + "language"
    const lang = localStorage.getItem(key)

    if(lang)
    {
      const la = parseInt(lang)
      handleLanguage(la)
    }
    else
    {
      handleLanguage(71)
    }
  },[])
  useEffect(()=>{
      handleLanguage(71);
  },[currentLevel]);
  const getQuestionsFromLocalStorage = (
    numberOfQuestions: number,
    levelNo: number
  ): answerType => {
    let questions: answerType = JSON.parse(
      localStorage.getItem("codeData")!
    ) || { finalAnswer: [] };

    if (!questions.finalAnswer[levelNo]) {
      questions.finalAnswer[levelNo] = { answer: [] };
    }
    for (let i = 1; i <= numberOfQuestions; i++) {
      const keyPrefix = `${i}`;
      const key = `Level${getCurrentLevelIndex()}Question${i}language`;
      const value = localStorage.getItem(key);
      const Resultkey = `Level${getCurrentLevelIndex()}Question${i}LanguageCode${value}Result`;
      const testResult:testCaseResult = JSON.parse(localStorage.getItem(Resultkey) || "{}");

      questions.finalAnswer[levelNo].answer[i - 1] = {
        code:
          localStorage.getItem(`Level${levelIndex}Question${i}LanguageCode${value}`) ||
          "",
        language:
          localStorage.getItem(
            "Level" +
              getCurrentLevelIndex() +
              "Question" +
              `${keyPrefix}language`
          ) || "71",
        
        answered:
          Boolean(
            localStorage.getItem(
              "Level" + getCurrentLevelIndex() + "question" + i + "answered"
            )
          ) || false,
        testCaseResult: testResult,
        questionNo: i,
        levelIndex: levelNo,
      };
    }
    let score = 0;
    for (let i = 0; i < questions.finalAnswer[levelNo].answer.length; i++) {
      if (questions.finalAnswer[levelNo].answer[i].answered) {
        score++;
      }
    }
    questions.finalAnswer[levelNo].score = score;
    questions.timeLeft = timer;
    setCodeData(questions);
    localStorage.setItem("codeData", JSON.stringify(questions));
    return questions;
  };
  const handleSubmit = async () => {
    if (!Result) return toast.error("Run the Code First");
    showLoading(true);

    if (!Result.sucess) {
      toast.warning("Please correct the errors before submitting");
      showLoading(false);
      return;
    }

    const correctAnswer =
      currentLevel.questions[questionNo - 1].content.testCase;
    try {
      //logic need to be changed to test case logic
      const result = await ExecuteTestCases(currentLevel, questionNo, code, language);
      if (!result) {
        toast.error("Error executing test cases, try again");
        showLoading(false);
        return;
      }
      if (
        Result.testCaseFailed == 0 &&
        Result.testCaseSucceded === correctAnswer.length
      ) {
        save();
        localStorage.setItem(
          "Level" +
            getCurrentLevelIndex() +
            "question" +
            questionNo +
            "answered",
          "true"
        );
        const key = `Level${getCurrentLevelIndex()}Question${questionNo}LanguageCode${language}Result`;
        localStorage.setItem(key, JSON.stringify(Result));
        getQuestionsFromLocalStorage(
          currentLevel.questions.length,
          getCurrentLevelIndex()
        );
        codeDataToDB();
        setResult(null);
        toast.success("Correct answer");
      } else {
        localStorage.setItem(
          "Level" +
            getCurrentLevelIndex() +
            "question" +
            questionNo +
            "answered",
          "false"
        );
        const key = `Level${getCurrentLevelIndex()}Question${questionNo}LanguageCode${language}Result`;
        localStorage.setItem(key, JSON.stringify(Result));
        toast.error("Error in Test Cases");
      }
    } finally {
      showLoading(false);
    }
  };

  useEffect(() => {
    const key = `Level${getCurrentLevelIndex()}Question${questionNo}language`;
    const value = localStorage.getItem(key);
    const temp = parseInt(value ?? "71", 10);
    clearOutput();
    SetLanguage(temp);
  }, [questionNo]);
  useEffect(() => {
    localStorage.setItem(
      "Level" + getCurrentLevelIndex() + "Question" + questionNo + "output",
      Result?.output!
    );
  }, [Result]);
  const save = () => {
    const key = `Level${getCurrentLevelIndex()}Question${questionNo}LanguageCode${language}`;
    localStorage.setItem(
      key,
      code
    );
    const languageKey = `Level${getCurrentLevelIndex()}Question${questionNo}language`;
    localStorage.setItem(
      languageKey,
      language.toString()
    );
    //toast.success("Saved Successfully");
  };
  useEffect(() => {
    let storedCode;
    console.log("Question Changed");
    const currentIndex = getCurrentLevelIndex()
    const LanguageKey = `Level${currentIndex}Question${questionNo}language`
    const la = localStorage.getItem(LanguageKey) ?? "71"
    SetLanguage(parseInt(la))
    const Tempkey = `Level${currentIndex}Question${questionNo}LanguageCode${la}`;

    console.log(Tempkey)
    if (useLevel) {
      const key = `Level${levelIndex}Question${questionNo}LanguageCode${la}`;
      storedCode =
      
        localStorage.getItem(key) ||
        "";
    } else {
      storedCode =
        localStorage.getItem(
          Tempkey
        ) || "";
    }
    setCode(storedCode);
  }, [questionNo, useLevel]);
  // const messages = [
  //   "Well done! You've successfully conquered another coding question!",
  //   "Nice work! One more coding puzzle down, keep the momentum going!",
  //   "Fantastic! You've completed another step towards victory!",
  //   "You're on fire! Another coding challenge solved, just a few more to go!"
  // ];
  // const generateRandom = (val:number):number =>{
  //   const temp = Math.floor(Math.random() * val);
  //   return temp;
  // }
  const changeNextBtn = (): boolean => {
    const maxLength = localStorage.getItem("MaxLength");
    if (maxLength) {
      const length = parseInt(maxLength);
      if (currentLevel.levelIndex === length - 1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  if (breakTimer) {
    return (
      <div className="w-full fixed bgBreakTimer text-black flex flex-col justify-center items-center h-screen">
        <p className="text-center font-semibold p-2 absolute top-[27rem] text-2xl text-white bg-black/70 rounded-lg">
          Halfway through, it's time to rest,
          <br />
          15 minutes to recharge and do your best!
        </p>
        <div className="absolute top-36 flex flex-col bgBreakTimerC h-72 w-72 items-center justify-center">
          <p className="text-4xl  mt-8 mr-4 text-cyan-300 uppercase font-bold font-Orbiton">
            {formatBreakTime(breakTime)}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`ace-${theme ? theme : "dracula"} ${
        useLevel ? "pointer-events-none" : ""
      } ${
        codeData?.finalAnswer[currentLevelIndex]?.answer[questionNo - 1]
          ?.answered
          ? "pointer-events-none"
          : ""
      } relative h-screen p-5 overflow-hidden`}
    >
      <p  className="text-4xl textShadow font-bold text-center font-Orbiton tracking-widest animate-bounce uppercase">Hackathon 2k25</p>
      
      {codeData?.finalAnswer[currentLevelIndex]?.answer[questionNo - 1]
        ?.answered && (
        <p className="text-xl text-green-500 uppercase font-bold absolute top-5 right-10">
          completed
        </p>
      )}
      {levelIncrease && (
        <button
          className="absolute bottom-10 bg-green-600 px-2 font-bold border-2 hover:bg-green-800 w-fit h-10 rounded-md cursor-pointer pointer-events-auto right-96 uppercase font-Orbiton"
          onClick={handleDatasubmit}
        >
          {changeNextBtn() ? "Exit" : "next Level"}
        </button>
      )}
      <div className="flex gap-4 mt-6">
        <DropDown
          options={themes}
          onSelect={handleTheme}
          theme={theme}
          value={theme}
          condition={"Theme"}
        />
        <DropDown
          options={languages}
          onSelect={handleLanguage}
          theme={theme}
          value={language}
          condition={"Language"}
        />
        <p className="text-center  text-xl font-bold  ">
          LEVEL: {currentLevel.levelIndex}
        </p>
        <p className="text-center  text-xl font-bold  ">
          QUESTION: {questionNo}
        </p>
        <div
          style={{ border: "2px solid", borderRadius: "8px",borderColor:"#274c77" }}
          className="flex absolute bg-[#e7ecef] h-12 shadow-md shadow-gray-500  w-fit p-2 right-52 mr-10 top-20 justify-center items-center"
        >
          <Lottie
            animationData={timerAni}
            loop={timerRunning}
            className="w-20 -ml-6"
          />
          <p className="text-xl font-mono font-bold text-black">{formatTime(timer)}</p>
        </div>
        <div className="absolute right-10 top-22 flex">
          <button>
            <VscCheck
              size={30}
              onClick={handleSubmit}
              className={`mr-4 hover:scale-105 active:scale-90`}
            />
          </button>
          {/* <VscSave
            onClick={handleSave}
            title="Save"
            size={30}
            className="mr-4 cursor-pointer hover:scale-105 active:scale-90"
          /> */}
          <VscPlay
            onClick={runCode}
            title="Run"
            size={30}
            className="pointer-events-auto cursor-pointer hover:scale-105 active:scale-90"
          />
        </div>
      </div>
      <div className="flex w-full gap-4 mt-7">
        <div className={`${showResult ? "w-fit" : "w-full"} mt-2   rounded-sm resize-x`}>
          <AceEditor
            mode={`${languages
              .find((v) => v.value == language)
              ?.mode}`}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
            }}
            theme={`${theme ? theme : "dracula"}`}
            width={`${showResult ? "45rem" : ""}`}
            height="30rem"
            style={{ border: "2px solid", borderRadius: "8px" }}
            showPrintMargin={false}
            className="shadow-md shadow-gray-500"
            fontSize={20}
            value={code}
            onChange={(e) => {
              language
                ? setCode(e)
                : toast.warning("Please Choose the language");
                
            }}
          />
        </div>
        <div
          style={{ border: "2px solid", borderRadius: "8px" }}
          className={` w-full mt-2 h-[30rem] p-2 overflow-y-auto shadow-md shadow-gray-500 ${showResult ? "block" : "hidden"}`}
        >
          <div className="flex justify-between">
            <p className="text-2xl font-serif font-bold">Result:</p>
            {/* <FaTrash
              size={22}
              onClick={clearOutput}
              className="pointer-events-auto m-1 cursor-pointer"
              title="clear output window"
            /> */}
          </div>
          <div className="w-full">
            {!Result ? (
              <div className="w-full flex justify-center">
                <Lottie animationData={empty} className="w-96" loop={true} />
              </div>
            ) : Result.output === "Compiling" ? (
              <div className="w-full flex justify-center">
                <Lottie animationData={loading} className="w-96" loop={true} />
              </div>
            ) : (
              <TestCase caseResult={Result}></TestCase>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full">
  {/* Shortcuts Left Box */}
  <div className="flex w-full mt-6">
    <div
      className="flex flex-col w-fit z-30 px-5 py-3 gap-3 font-Orbiton font-bold"
      style={{ border: "2px solid", borderRadius: "8px" }}
    >
      <p className="text-center underline">Keyboard Shortcuts</p>
      <div className="flex flex-col gap-2 text-sm">
        <p><span className="font-semibold">Alt + R</span> → Run the program</p>
        <p><span className="font-semibold">Alt + S</span> → Submit the program</p>
      </div>
    </div>
  </div>

  {/* Shortcuts Right Box */}
  <div className="flex w-full justify-end mt-6">
    <div
      className="flex flex-col w-fit z-30 px-5 py-3 gap-3 font-Orbiton font-bold"
      style={{ border: "2px solid", borderRadius: "8px" }}
    >
      <p className="text-center underline">Keyboard Shortcuts</p>
      <div className="flex flex-col gap-2 text-sm">
        <p><span className="font-semibold">Alt + Q</span> → Open the question panel</p>
        <p><span className="font-semibold">Alt + N</span> → Toggle fullscreen mode</p>
      </div>
    </div>
  </div>
</div>

      
            
      <ToastContainer position="top-right" stacked />
       <iframe
        ref={iFrameRef}
        height="450px"
        src="https://onecompiler.com/embed/python?codeChangeEvent=true&listenToEvents=true&theme=dark"
        width="100%"
        className="hidden"
      ></iframe>
    </div>
  );
};

export default Editor;
