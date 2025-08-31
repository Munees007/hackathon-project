import { Drawer } from "antd";
import { useEffect, useState } from "react";
import { MdAdsClick } from "react-icons/md";

import ResultDisplay from "../Components/ResultPage";
import { ScoreType } from "../Pages/Score";
import { fetchScoreData } from "../Database/functions/addData";
import { useLocation } from "react-router-dom";


const PresentationPage = () => {
    const [showDrawer, setShowDrawer] = useState<boolean>(false);
    const [data, setData] = useState<ScoreType[]>([]);

    const location = useLocation();

    const score = location.state.score as ScoreType[]

    useEffect(() => {
        const fetchData = async () => {
            if (score) {
                const res = await fetchScoreData();
                setData(res);
                console.log(res);
            }
        };
        fetchData();

        const goFullscreen = () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            }
            setShowDrawer(true);
        };

        const exitDrawer = (event:KeyboardEvent) => {
            if (event.key === "x") {
                setShowDrawer(false);
            }
        };

        document.addEventListener("click", goFullscreen);
        document.addEventListener("keydown", exitDrawer);

        return () => {
            document.removeEventListener("click", goFullscreen);
            document.removeEventListener("keydown", exitDrawer);
        };
    }, [score]);

    return (
        <div className="w-full">
            <Drawer
                placement="left"
                open={showDrawer}
                style={{
                    height: "100vh",
                    position: "absolute",
                    top: "0",
                    left: "0",
                    zIndex: "1000",
                    width: "100vw"
                }}
            >
                {data !== null && <ResultDisplay data={data}/>}
            </Drawer>
            <div className="w-full h-screen flex flex-col gap-2 justify-center items-center">
                <MdAdsClick size={100} />
                <h1 className="text-3xl">Click anywhere to start Presentation</h1>
            </div>
        </div>
    );
};

export default PresentationPage;
