import { Link } from "react-router-dom";
import { userDataType } from "../Pages/Admin";
import React, { useEffect, useState } from "react";
import { Level } from "../types/QuestionType";
import { Button,Select, Spin, Table, TableProps } from 'antd';
import {  GenerateparticipantsScore } from '../Functions/GeneratePDF';
import { FormData } from '../Components/Form';
import { AddScore, fetchScoreData } from "../Database/functions/addData";
import { toast } from "react-toastify";
interface ScoreUsersProps {
    userData: userDataType[],
    levelData: Level[],
}

export type ScoreType = 
{
    FormData: FormData
    Position: string
    Id:string
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




const Score: React.FC<ScoreUsersProps> = ({ userData, levelData }) => {
    const [sortMethod, setSortMethod] = useState<string>("Score");
    const [sortedData, setSortedData] = useState<userDataType[]>(userData);
    const [selectedDate,setSelectedDate] = useState<string>("all");
    const [Dates,setDates] = useState<string[]>([]);
    const [_,setFormData] = useState<FormData[]>([])
    const [loading, setLoading] = useState<boolean>(false);
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
          const timeA = (60 * 60) - (a.codeData?.timeLeft !== undefined ? a.codeData?.timeLeft : (0));
          const timeB = (60 * 60) - (b.codeData?.timeLeft !== undefined ? b.codeData?.timeLeft : (0));
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
            const timeA = (60 * 60) - (a.codeData?.timeLeft !== undefined ? a.codeData?.timeLeft : (0));
            const timeB = (60 * 60) - (b.codeData?.timeLeft !== undefined ? b.codeData?.timeLeft : (0));
            return timeA - timeB; // Smallest first
        });
    };

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
              <span>{formatTime((60 * 60) - record?.codeData?.timeLeft!)}</span>
            );
          },
        },
        {
  title: "Position",
  key: "position",
  render: (_, record, index) => (
    <Select
      value={record.Position}
      onChange={(e) => {
        
        const newData = [...sortedData];

       
        newData[index].Position = e;

        
        if (["I", "II", "III"].includes(e)) {
          newData.forEach((row, i) => {
            if (i !== index && row.Position === e) {
              row.Position = "P";
            }
          });
        }

        setSortedData(newData); 
      }}
      options={[
        { value: "P", label: "P" },
        { value: "I", label: "I" },
        { value: "II", label: "II" },
        { value: "III", label: "III" },
      ]}
    />
  ),
}

      ];
      
      useEffect(() => {
        sortByDate();
        let sortedData;
    
    
        // Sorting logic based on the sort method
        
            if (sortMethod === "Score") {
                sortedData = sortByScore();
            } else if (sortMethod === "TotalLine") {
                sortedData = sortByTotalLines();
            } else if (sortMethod === "TimeTaken") {
                sortedData = sortByTimeTaken();
            } else if (sortMethod === "bothScoreTime") {
                sortedData = sortByScoreAndTime();
            }
       
        
        setFormData(userData.map((data)=> data.formData))
        // Update the state with the sorted data
        setSortedData(sortedData!);
    }, [userData, sortMethod, selectedDate]);
    
    
    const handleSubmit =  async () =>{
        setLoading(true);
        const scoreData:ScoreType[] = []

        sortedData.forEach((data)=>{
            let temp: ScoreType = {FormData:data.formData,Position:data.Position,Id:data.formData.rollNumber}
            scoreData.push(temp)
        })

        try{
            await AddScore(scoreData);
            toast.success("Score Added");
        }
        catch(e)
        {
            toast.error("Score adding failed")
        }
        finally {
      setLoading(false);
    }

    }
    return (
        <div className="w-full overflow-auto relative">
            <Spin spinning={loading} tip="Submitting..."></Spin>
            <div className="flex justify-end w-full gap-2">
                <Button type="primary" size="large" onClick={ async ()=>{
                  const data = await fetchScoreData()
                  GenerateparticipantsScore(data);}}>Download Score</Button>
                
            </div>
            <p className="text-center font-Roboto text-2xl font-exdivabold">"Hackathon Score"</p>
            
            <div className="w-full flex justify-start">
                    <p className="mr-2">Seprate Data with Date:</p>
                    <select className="border-2 rounded-md" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
                        <option value="all">All</option>
                        {
                            Dates.map((date,index)=>(
                                <option value={date} key={index}>{date.toUpperCase()}</option>
                            ))
                        }
                    </select>
                </div>
            
                <div className="w-full flex justify-end">
                    <p className="mr-2">Sorting Method:</p>
                    <select className="border-2 rounded-md" value={sortMethod} onChange={(e) => setSortMethod(e.target.value)}>
                        <option value="TotalLine">Total Line</option>
                        <option value="Score">Score</option>
                        <option value="TimeTaken">Time Taken</option>
                        <option value="bothScoreTime">Both Score & Time</option>
                    </select>
                </div>
            
            <div className="w-full  p-5">
                <Table columns={DashColumns} dataSource={sortedData}/>
            </div>
            <div className="flex justify-end w-full">
                <Button type="primary" size="middle" onClick={handleSubmit}>Submit</Button>
            </div>

        </div>
    );
};

export default Score;
