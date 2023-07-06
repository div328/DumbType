import { onAuthStateChanged ,signOut} from 'firebase/auth';
import { collection, getDocs, where ,query ,onSnapshot} from 'firebase/firestore';
import React, { useEffect,useState } from 'react'
import {useNavigate } from 'react-router-dom';
import {auth,db} from '../config/firebase';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';



const Account = () => {
  const [user , setUser] = useState({});
  const [render , setRender] = useState(false);
  const [view , setView] = useState(false);
  var flag=true;
  const [id,setId]=useState("");
  const userCollectionRef = collection(db,"Users");
  const navigate = useNavigate();
  
  useEffect(() =>{
    onAuthStateChanged(auth , () =>{
      if(flag){
      const getUserData = async () =>{
        try{
          flag=false;
          const q = query(userCollectionRef , where("email" , "==" ,auth.currentUser.email));
          const userData = await getDocs(q);
          if(userData.docs.length!==0){
          const tempHolder = userData.docs[0].data();
          setId(userData.docs[0].id);
          setUser(tempHolder);
          }
          else{
           console.log("NO User");
          }
        } catch (err){
          console.log(err);
        }
      }
      getUserData();
    }});
  } ,[]);

  useEffect(()=>{
    if(Object.keys(user).length!==0){
      setRender(true);
    }else{
      setRender(false);
    }
  } ,[user]);

   function xyz()
  {
    return (<><Line
      datasetIdKey='id'
      data={{
        labels: user.maxspeed.arRaw.map((x,i) => i+1),
        datasets: [
          {
            id: 1,
            label: 'act',
            data: user.maxspeed.arWpm,
            borderColor:'yellow',
            backgroundColor:'yellow'
          },
          {
            id: 2,
            label: 'raw',
            data: user.maxspeed.arRaw,
            borderColor:'grey',
            backgroundColor:'#FEFCFF' 
          },
        ],
      }}
    /></>);
  }
 

  const logOut = () =>{
    try{
     signOut(auth);
     navigate('/login');
    }catch(err){
      console.error(err);
    }
  };

  const getGraph = () =>{
    if(user.maxspeed.arRaw.length===0){
      setView(false);
    }
    else{
      setView((pre) => (!pre));
    }
  };

  return (
    <>{ render &&
    <><div className='profileInfo'>
    <div className='firstSquare'>
      <div className='userName'>{user.name}<span className='email'>email: {user.email}</span><span className='join'>joined {user.join}</span></div>
      <div className='testInfo'><div className='testStarted'><span>test started</span></div><span>{user.testStarted}</span></div>
      <div className='testInfo'><div className='testCompleted'>test completed<span></span></div><span>{(user.testComp)}</span></div>
      <div className='totalTime'><div className='totaltime'>total time (min)<span></span></div><span>{(user.testComp*30)/60}</span></div>
    </div>
    <div className='secondSquare'>
    <div className='correctTyped'><div className='correctChar'><span>correct typed char</span></div><span>{user.maxspeed.totalCorrect}</span></div>
    <div className='incorrectTyped'><div className='incorrectChar'><span>incorrect typed char</span></div><span>{user.maxspeed.totalMiss}</span></div>
    <div className='correctTypedWord'><div className='correctCharWord'><span>correct typed word</span></div><span>{Math.floor((user.maxspeed.totalCorrect)/5)}</span></div>
    <div className='totalTypedWord'><div className='totalCharWord'><span>total typed word</span></div><span>{Math.floor(user.maxspeed.totalChar/5)}</span></div>
    </div>
    <div className='thirdSquare'>
    <div className='maxWpm'><div className='subWpm'><span>highest wpm</span></div><span>{(user.maxspeed.wpm)}</span></div>
    <div className='maxRaw'><div className='subRaw'><span>highest raw wpm</span></div><span>{(user.maxspeed.raw)}</span></div>
    <div className='maxAccuracy'><div className='subAccuracy'><span>highest accuracy</span></div><span>{(user.maxspeed.accuracy)}</span></div>
    <div className='maxGraph'><div className='butoondiv'><button className='view' onClick={getGraph}>view</button></div></div>
    </div> 
    <div className='graph' style={{visibility:(view ?"visible":"hidden") , position:(view?"":"absolute")}}>{xyz()}</div>
    </div>
    <button className='logout' onClick={logOut}>Logout</button></>}
    
    </>
  )
}

export default Account