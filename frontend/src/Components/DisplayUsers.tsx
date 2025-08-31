import { Link } from "react-router-dom";
import { userDataType } from "../Pages/Admin";
import React, { useEffect, useState } from "react";
import { Level } from "../types/QuestionType";
import { Button, Table, TableProps } from 'antd';
import { GenerateparticipantsList } from '../Functions/GeneratePDF';
import { FormData } from './Form';
import { getTime, setTime } from "../Database/functions/addData";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.min.css"
interface DisplayUsersProps {
    userData: userDataType[],
    levelData: Level[],
    display: boolean,
    handleFlag: () => Promise<void>,
    flag: boolean
}

const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
};

export const getScore = (data: userDataType): number => {
    let score = 0;
    for (let i = 0; i < data?.codeData?.finalAnswer?.length; i++) {
        score += data?.codeData?.finalAnswer[i]?.score!;
    }
    return score;
};

const getCodeLength = (code: string): number => {
    return code ? code.split('\n').length : 0;
};

const getTotalLine = (value: userDataType): number => {
    let lines = 0;
    value?.codeData?.finalAnswer?.forEach((val) => {
        val.answer.forEach((answer) => {
            lines += getCodeLength(answer.code);
        });
    });
    return lines;
};




const DisplayUsers: React.FC<DisplayUsersProps> = ({ userData, levelData, display, handleFlag, flag }) => {
    const [sortMethod, setSortMethod] = useState<string>("Score");
    const [sortedData, setSortedData] = useState<userDataType[]>(userData);
    const [selectedDate,setSelectedDate] = useState<string>("all");
    const [Dates,setDates] = useState<string[]>([]);
    const [formDatas,setFormData] = useState<FormData[]>([])
    const [dbTime,setDbTime] = useState<number>(0);
    const [newTime,setNewTime] = useState<number>(0);
    useEffect(()=>{
        const fetchData =async()=>{
            const res = await getTime();
            if(res)
            {
                setDbTime(res);
            }
        }
        fetchData();
    },[])
    const sortByScore = () => {
        const data = seperateDataWithDate();
        return [...data].sort((a, b) => getScore(b) - getScore(a)); // Highest score first
    };

    const sortByTotalLines = () => {
      const data = seperateDataWithDate();
        return [...data].sort((a, b) => getTotalLine(a) - getTotalLine(b)); // Smallest first
    };

    const sortByTimeTaken = () => {
      const data = seperateDataWithDate();
        return [...data].sort((a, b) => {
          const timeA = (dbTime) - (a.codeData?.timeLeft !== undefined ? a.codeData?.timeLeft : (0));
          const timeB = (dbTime) - (b.codeData?.timeLeft !== undefined ? b.codeData?.timeLeft : (0));
            return timeA - timeB; // Smallest first
        });
    };
    const sortByScoreAndTime = () => {
      const data = seperateDataWithDate();
        return [...data].sort((a, b) => {
            // Get scores
            const scoreA = getScore(a);
            const scoreB = getScore(b);
    
            // Sort by score first (highest score first)
            if (scoreB !== scoreA) {
                return scoreB - scoreA;
            }
    
            // If scores are equal, sort by time taken (smallest first)
            const timeA = (dbTime) - (a.codeData?.timeLeft !== undefined ? a.codeData?.timeLeft : (0));
            const timeB = (dbTime) - (b.codeData?.timeLeft !== undefined ? b.codeData?.timeLeft : (0));
            return timeA - timeB; // Smallest first
        });
    };

    const sortByTestCases = () =>{
        const data = sortByScoreAndTime();
        return [...data].sort((a,b)=>{
            let totalCaseSolvedA = 0;
            a?.codeData?.finalAnswer?.forEach((val)=>{
                val.answer.forEach((answer)=>{
                    if(answer.testCaseResult)
                    {
                        totalCaseSolvedA += answer.testCaseResult.testCaseSucceded;
                    }
                })
            })
            let totalCaseSolvedB = 0;
            b?.codeData?.finalAnswer?.forEach((val)=>{
                val.answer.forEach((answer)=>{
                    if(answer.testCaseResult)
                    {
                        totalCaseSolvedB += answer.testCaseResult.testCaseSucceded;
                    }
                })
            })
            return totalCaseSolvedB - totalCaseSolvedA;
        });
    }

    const seperateDataWithDate = () =>{
        return selectedDate === "all" ? userData : [...userData].filter((item)=>{
            const timeStamp = item.formData.timestamp;
            if(typeof timeStamp === 'number')
            {
                const itemDate = new Date(timeStamp).toLocaleDateString()
                console.log(itemDate)
                return itemDate === selectedDate;
            }
            return false
        })
    }

    const sortByDate = () => {
        const TimeStamps: Set<string> = new Set(); // Using Set to avoid duplicates
    
        userData?.forEach((user) => {
            let timestampValue = user?.formData?.timestamp;
    
            if (typeof timestampValue === 'number') {

              const date = new Date(timestampValue); // Convert to JavaScript Date
                TimeStamps.add(date.toLocaleDateString());
            }
        });
    
        const dates:string[] = [];
    
        // Now iterate over the Set and log the formatted date
        TimeStamps.forEach((date) => {
            
            dates.push(date);
        });
        console.log(dates);
        setDates(dates);
    };
    
    
    
                            
    const columns:TableProps<userDataType>['columns'] = [
        {
            key:"sno",
            title:"S.No",
            dataIndex:"sno",
            render:(_,__,index)=>{
                return(<p>{index + 1}</p>);
            }
        },
        {
            key:"rollNumber",
            title:"Roll No",
            dataIndex:"rollNumber",
            render(_, record) {
                return <p>{record.formData.rollNumber}</p>
            },
        },
        {
            key:"name",
            title:"Name",
            dataIndex:"name",
            render(_, record) {
                return <p>{record.formData.name}</p>
            },
        },
        {
            key:"email",
            title:"Email",
            dataIndex:"email",
            render(_, record) {
                return <p>{record.formData.email}</p>
            },
        },
    ];
    const DashColumns: TableProps<userDataType>['columns'] = [
        {
          title: "S.No",
          key: "sno",
          render: (_, __, index) => {
            return <span>{index + 1}</span>;
          },
        },
        {
          title: "Roll No",
          key: "rollNumber",
          render: (_, record) => {
            return (
              <Link to={`/profile/${record.formData.name}`} state={{ value: record, levelData }}>
                {record.formData.rollNumber}
              </Link>
            );
          },
        },
        {
          title: "Name",
          key: "name",
          render: (_, record) => {
            return <span>{record.formData.name}</span>;
          },
        },
        {
          title: "Email",
          key: "email",
          render: (_, record) => {
            return <span>{record.formData.email}</span>;
          },
        },
        {
          title: "Code Length",
          key: "codeLength",
          render: (_, record) => {
            return record?.codeData ? (
              <>
                {levelData?.map((q, index) => (
                  q?.questions?.map((_, inIndex) => (
                    <span key={`codeLength_${index}_${inIndex}`}>
                      {getCodeLength(record?.codeData?.finalAnswer[index]?.answer[inIndex]?.code || "")}
                    </span>
                  ))
                ))}
              </>
            ) : (
              <span>-</span>
            );
          },
        },
        {
          title: "Total Lines",
          key: "totalLines",
          render: (_, record) => {
            return <span>{getTotalLine(record)}</span>;
          },
        },
        {
            title: "Test Cases Solved",
            key: "testCases",
            render: (_, record) => {
                let totalTestCasesSolved = 0;
                 record?.codeData?.finalAnswer?.forEach((val)=>{
                    val.answer.forEach((answer)=>{
                        if(answer.testCaseResult)
                        {
                            totalTestCasesSolved += answer.testCaseResult.testCaseSucceded;
                        }
                    })
                });
                return <span>{totalTestCasesSolved}</span>;
            }
        },
        {
          title: "Score",
          key: "score",
          render: (_, record) => {
            return <span>{getScore(record)}</span>;
          },
        },
        {
          title: "Time Taken",
          key: "timeLeft",
          render: (_, record) => {
            return (
              <span>{formatTime((dbTime) - record?.codeData?.timeLeft!)}</span>
            );
          },
        },
      ];
      
      useEffect(() => {
        sortByDate();
        let sortedData;
    
    
        // Sorting logic based on the sort method
        if (display) {
            if (sortMethod === "Score") {
                sortedData = sortByScore();
            } else if (sortMethod === "TotalLine") {
                sortedData = sortByTotalLines();
            } else if (sortMethod === "TimeTaken") {
                sortedData = sortByTimeTaken();
            } else if (sortMethod === "bothScoreTime") {
                sortedData = sortByScoreAndTime();
            }
            else if (sortMethod === "testCases") {
                sortedData = sortByTestCases();
            }
        }
        else
        {
            sortedData = seperateDataWithDate();
        }
        
        setFormData(userData.map((data)=> data.formData))
        // Update the state with the sorted data
        setSortedData(sortedData!);
    }, [userData, sortMethod, display, selectedDate]);
    


    return (
        <div className="w-full overflow-auto">
          
            <p className="text-center font-Roboto text-2xl font-exdivabold">{display ? "Hackathon Score" : "Registered Student Lists"}</p>
            {!display && (
                <div className="w-full gap-2 flex justify-between p-2 items-center">
                    <div className="flex flex-col gap-2">
                        <p className="font-Roboto font-bold">Current Time: {formatTime(dbTime)}</p>
                        <div className="flex gap-2 items-center">
                        <input type="number" onChange={(e)=>{
                            const val = e.target.value
                            setNewTime(parseInt(val))
                        }} className="border-2 rounded-md border-black" placeholder=" Set new Time as seconds"></input>
                        <Button type="primary" size="middle" onClick={async()=>{
                            await setTime(newTime);
                            setDbTime(newTime)
                            toast.success(`Time Updated Successfully, new Time = ${formatTime(newTime)}`)
                        }}>Change</Button>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center">
                    <p className="font-Roboto font-bold">START:</p>
                    <span title="flag" className={`bg-[#2f81edaf] w-14 h-6 rounded-full flex items-center ${flag ? "justify-end" : ""}`}>
                        <span onClick={handleFlag} className="bg-gray-600 border w-5 cursor-pointer h-5 rounded-full"></span>
                    </span>
                    <Button type='primary' size='large' onClick={()=>{GenerateparticipantsList(formDatas)}}>Download List</Button>
                    </div>
                </div>
            )}
            <div className="w-full flex justify-start mt-3">
                    <p className="mr-2 font-bold">Seprate Data with Date:</p>
                    <select className="border-2 rounded-md" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
                        <option value="all">All</option>
                        {
                            Dates.map((date,index)=>(
                                <option value={date} key={index}>{date.toUpperCase()}</option>
                            ))
                        }
                    </select>
                </div>
            {display && (
                <div className="w-full flex justify-end">
                    <p className="mr-2">Sorting Method:</p>
                    <select className="border-2 rounded-md" value={sortMethod} onChange={(e) => setSortMethod(e.target.value)}>
                        <option value="TotalLine">Total Line</option>
                        <option value="Score">Score</option>
                        <option value="TimeTaken">Time Taken</option>
                        <option value="bothScoreTime">Both Score & Time</option>
                        <option value="testCases">Test Cases</option>
                    </select>
                </div>
            )}
            <div className="w-full  p-5">
                {/* {sortedData && sortedData.map((value, index) => (
                    <div key={index} style={gridTemplateColumns(questionCount(levelData),display)} className={`w-full overflow-auto   gap-5 p-2 bg-gray-300 hover:bg-gray-400 border border-black grid  rounded-sm`}>
                        <p className="">{index + 1}.</p>
                        <p className="">
                            <Link to={`/profile/${value.formData.name}`} key={index} state={{ value, levelData }} className={`${display ? "" : "pointer-events-none"}`}>
                                {value.formData.rollNumber}
                            </Link>
                        </p>
                        {
                        !display && <p>{value?.formData?.name}</p>
                    }
                    {
                        !display && <p>{value?.formData?.email}</p>
                    }
                        {display && (
                            <>
                                {value?.codeData ? (
                                    <>
                                        {levelData.map((q, index) => (
                                            q?.questions?.map((_, inedx) => (
                                                <p key={`codeLength_${index}_${inedx}`}>{getCodeLength(value?.codeData?.finalAnswer[index]?.answer[inedx]?.code || "")}</p>
                                            ))
                                        ))}
                                        <p className="">{getTotalLine(value)}</p>
                                        <p className="">{getScore(value)}</p>
                                        <p className="w-20">{formatTime(((60 * 150) - value?.codeData?.timeLeft!))}</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="">-</p>
                                        <p className="">{formatTime((60*150))}</p>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                ))} */}
                <Table columns={!display ? columns : DashColumns} dataSource={sortedData}/>
                <ToastContainer></ToastContainer>
            </div>
        </div>
    );
};

export default DisplayUsers;
