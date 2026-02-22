import { useEffect, useRef, useState } from 'react'
import './App.css'
import { enterFullScreen } from './Functions/FullScreen'
import Home from './Pages/Home'
import {Routes,Route, useLocation, useNavigate} from 'react-router-dom'
import CodeSpace from './Pages/CodeSpace'
import Admin from './Pages/Admin'
import Profile from './Components/Profile'
import ThankYou from './Pages/ThankYou'
import QuestionPage from './Components/QuestionPage'
import TestPage from './Pages/testPage'
import { Flag } from './Pages/Flag'
import { FeedBack } from './Pages/FeedBack'
import {LeaderBoard} from './Pages/LeaderBoard'
import RulesCard from './Components/RulesCard'
import PresentationPage from './Components/PresentationPage'
import Registration from './Pages/Registration'
import { ToastContainer } from 'react-toastify'
import { BrainSpark } from './Pages/BrainSpark'
import { TabSwitch } from './types/TabSwtichTimerType'

function App() {
  const location = useLocation();
  const naviagte = useNavigate();
  const [_,setSwitchCount] = useState<number>(0)
  const [tabSwitched, setTabSwitched] = useState<TabSwitch[]>(() => {
  const saved = localStorage.getItem("tabSwitchLogs");
  if (!saved) return [];

  const parsed = JSON.parse(saved);

  // Convert back to Date objects
  return parsed.map((item: any) => ({
    ...item,
    timeSwitched: new Date(item.timeSwitched),
    inactiveTime: new Date(item.inactiveTime),
  }));
});
  useEffect(()=>{
    
    document.addEventListener('keydown', event => {
      if (event.key === 'F11') {
        event.preventDefault();
        return false;
      }
      if(event.key === 'F2')
      {
        naviagte('/');
        return false;
      }
      if(event.key === 'F9'){
        naviagte('/admin');
        return false;
      }
      if(event.key === 'F10'){
        naviagte('/flag');
        return false;
      }
      if(event.key === 'F8'){
        naviagte('/leaderboard');
        return false;
      }
      if(event.key === 'F7'){
        naviagte('/test');
        return false;
      }
    });
    document.addEventListener('contextmenu', event => {
        event.preventDefault();
        return false;
    });
  },[])

 const blurStartRef = useRef<Date | null>(null);

/**
 * Restore switch count from saved logs
 */
useEffect(() => {
  setSwitchCount(tabSwitched.length);
}, []);
useEffect(() => {

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      blurStartRef.current = new Date();
    }

    if (document.visibilityState === "visible") {
      if (!blurStartRef.current) return;

      const returnTime = new Date();

      const duration = Number(
        ((returnTime.getTime() - blurStartRef.current.getTime()) / 1000).toFixed(2)
      );

      if (duration < 0.5) {
        blurStartRef.current = null;
        return;
      }

      setTabSwitched(prev => {
        const newEntry: TabSwitch = {
          switchCount: prev.length + 1,
          timeSwitched: blurStartRef.current!,
          inactiveTime: returnTime,
          Duration: duration
        };

        const updated = [...prev, newEntry];

        localStorage.setItem("tabSwitchLogs", JSON.stringify(updated));

        return updated;
      });

      blurStartRef.current = null;
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };

}, []);
/**
 * Sync to localStorage whenever logs change
 */
useEffect(() => {
  localStorage.setItem("tabSwitchLogs", JSON.stringify(tabSwitched));
}, [tabSwitched]);

  useEffect(() => {
    console.log(location.pathname)
  if (location.pathname !== "/feedback" && location.pathname !== "/admin" && location.pathname !== "/registration") {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto"; // reset for feedback/admin
  }
}, [location.pathname]);

  return (
    <div onClick={()=>{enterFullScreen(location.pathname)}} className='overflow-hidden'>
      
    
        <Routes>
            <Route path='/' element={<Home/>}></Route>
            <Route path='/codespace' element={<CodeSpace/>}></Route>
            <Route path="/admin" element={<Admin/>}/>
            <Route path='/test' element={<TestPage/>}/>
            <Route path="/flag" element={<Flag/>}/>
            <Route path='/feedback' element={<FeedBack isView={false}/>}/>
            <Route path='/leaderboard' element={<LeaderBoard/>}/>
            <Route path='/profile/:userName' element={<Profile/>}/>
            <Route path='/thankYou' element={<ThankYou/>}/>
            <Route path='/qn' element={<QuestionPage/>}/>
            <Route path="/rule" element={<RulesCard/>}/>
            <Route path='/present' element={<PresentationPage/>}/>
            <Route path="/brain_spark" element={<BrainSpark/>}/>
            <Route path="/registration" element={<Registration/>}/>
        </Routes>
        <ToastContainer/>
    </div>
  )
}

export default App
