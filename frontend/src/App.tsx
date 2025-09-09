import { useEffect } from 'react'
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
import { CarGame } from './Pages/CarGame'
import Registration from './Pages/Registration'

function App() {
  const location = useLocation();
  const naviagte = useNavigate();
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
            <Route path="/car_game" element={<CarGame/>}/>
            <Route path="/registration" element={<Registration/>}/>
        </Routes>
      
    </div>
  )
}

export default App
