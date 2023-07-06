import React, { useEffect, useState } from 'react';
// import {useNavigate} from "react-router-dom";
import Timer from './Timer';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, where ,query ,doc ,updateDoc,getCountFromServer ,getDoc} from 'firebase/firestore';
import {auth,db} from '../config/firebase';




let sec=30;

const url = 'http://localhost:9000/paraget';
function TypeZone()
{   
   
  const [paragraph , setParagraph] = useState([]);
  const [currentCharIndex , setCurrentCharIndex] = useState(0);
  const [correct , setCorrect] = useState(0);
  const [incorrect , setIncorrect] = useState(0);
  const [relode , setRelode] = useState(false);
  const [Time, setTime] = useState(sec);
  const [status , setStatus] = useState(true);
  const [flag , setFlag] = useState(false);
  const [typed,setTyped]=useState(0);
  const [ rawData , setRawData] = useState([]);
  const [ actData , setActData] = useState([]);
  const [user , setUser] = useState({});
  const [up , setUp] = useState(false);
  const [id,setId] = useState("");
  var flag1=true;
 
  const userCollectionRef = collection(db,"Users");

  // user data
  const act = async () =>{
    user.maxspeed.wpm = actData[actData.length-1];
    user.maxspeed.raw = rawData[rawData.length-1];
    user.maxspeed.accuracy = Math.floor((correct/(typed))*100);
    user.maxspeed.totalCorrect = correct;
    user.maxspeed.totalMiss = incorrect;
    user.maxspeed.totalChar = typed;
    user.maxspeed.arRaw = rawData;
    user.maxspeed.arWpm = actData;
    const userRef = doc(db, "Users", id );
    await updateDoc(userRef, {
      maxspeed:user.maxspeed
    });
    console.log("act");
  }

  const validUpdate = () => {
      let wpm = user.maxspeed.wpm;
      let raw = user.maxspeed.raw;
      let accuracy = user.maxspeed.accuracy;
      let totalCorrect = user.maxspeed.totalCorrect;
      let totalMiss = user.maxspeed.totalMiss;
      console.log("valid Update");
      if(wpm<actData[actData.length-1]){
        act();
      }else if(wpm===actData[actData.length-1] && raw<rawData[rawData.length-1]){
        act();
      }else if(raw===rawData[rawData.length-1] && accuracy<(Math.floor((correct/(typed))*100))){
        act();
      }else if(accuracy===(Math.floor((correct/(typed))*100)) && totalCorrect<correct){
        act();
      }else if(totalCorrect===correct && totalMiss>incorrect){
        act();
      }
  }

  useEffect(() =>{
    onAuthStateChanged(auth , () =>{
      if(flag1){
      const getUserData = async () =>{
        try{
          flag1=false;
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

  useEffect(() =>{
    if((Object.keys(user).length!==0)){
    setUp(true);
    }else{
      setUp(false);
    }
  },[user]);

  useEffect(() =>{
    const induce = async () =>{
      console.log(id);
      console.log(user);
      if(flag===true && status===false){
        const userRef = doc(db, "Users", id );
        await updateDoc(userRef, {
          testStarted:(user.testStarted+1)
        });
        console.log("act");
      }
      if(status===false){
        const userRef = doc(db, "Users", id );
        await updateDoc(userRef, {
          testComp:(user.testComp+1)
        });
        validUpdate();
      }
  }
  if(up){
    induce();
  }
  else{
    console.log("Login to save");
  }
  
  }, [up,flag,status])

  //user data


  function updateStatus()
  {
    setStatus(false);
  }

  function addVal(x)
  {  
     let m = Math.floor(((correct+incorrect)/5)/(x/60));
     let y = Math.floor(((correct)/5)/(x/60));
     
     setRawData((pre) => [...pre ,m]);
     setActData((pre) => [...pre ,y]);

     console.log(actData);
     console.log(rawData);
  }

  function xyz()
  {
    return (<><Line
      datasetIdKey='id'
      data={{
        labels: rawData.map((x,i) => i+1),
        datasets: [
          {
            id: 1,
            label: 'act',
            data: actData,
            borderColor:'yellow',
            backgroundColor:'yellow'
          },
          {
            id: 2,
            label: 'raw',
            data: rawData,
            borderColor:'grey',
            backgroundColor:'#FEFCFF' 
          },
        ],
      }}
    />
    <div className='lowerPanel'>
      <h2>WPM  <span>{actData[actData.length-1]}</span></h2>
      <h2>Accuracy  <span>{Math.floor((correct/(typed))*100)}%</span></h2>
      <h2>Test Type  <span>{Time} sec</span> </h2>
      <h2>Tc/Cc/Ic  <span>{(typed)}/{correct}/{incorrect}</span>  </h2>
    </div>
    </>);
  }

 
  //function which invoke a request to server for paragraph from database
  async function paraFromServer2(){
    const coll = collection(db, "Paragraphs");
    const q = query(coll);
    const snapshot = await getCountFromServer(q);
    let x = snapshot.data().count;
    let y = (Math.floor((Math.random()*x))+1)+"";
    
    const paraRef = doc(db, "Paragraphs", y);
    const paraSnap = await getDoc(paraRef);

    if (paraSnap.exists()) {
      let xy=paraSnap.data().para.split(''); 
      setParagraph(xy);
    } else {
    console.log("No such document!");
    }
  }

  //useEffect which run when change para aur relode
  useEffect( () => {
    setParagraph([]);
    paraFromServer2();
    setCurrentCharIndex(0);
    setCorrect(0);
    setIncorrect(0);
    setRelode(false);
    setFlag(false);
    setStatus(true);
  },[relode]);

  

  useEffect(() => {
        
        const keyPressed = (event) =>
        {
         
         let key=event.key;

         //To change para
         if(key==='~')
         setRelode(true);
         if(status){
         //To prevent page movement
         if(event.keyCode===32) event.preventDefault();
         
         //Logic to add correct/incorrect class as we type
         if(key!=='Shift' && key!=='Capslock' && key!=="Backspace" && key!=='~'){
           setFlag(true);
           if(currentCharIndex>paragraph.length){
            updateStatus();
           }
           let y=key;
           let x=document.getElementById((""+currentCharIndex));
           setCurrentCharIndex(currentCharIndex+1);
           checkMatch(x,y);
          }
         
         //Logic to handel Backspace event
         if(key==="Backspace")
          { 
            let m=currentCharIndex-1;
            let x=document.getElementById((""+m));

            if(m<0)
            setCurrentCharIndex(0);
            else{
            setCurrentCharIndex(m);

            if(x.className==='correct')
            setCorrect((c) => (c+1));
            if(x.className==='incorrect')
            setIncorrect((i)=>(i-1));
            x.className='';    
            }                
          } 
        }
      }
        //Event listener for Keypressed state
        window.addEventListener('keydown',keyPressed);
        return () => {
          window.removeEventListener("keydown", keyPressed);
        };
      },[currentCharIndex,status]);


  function checkMatch(x,y) {
    const pressedKey = y;
    const matched = (pressedKey === x.innerText);
    if(matched){
    x.classList.add('correct');
    setCorrect((correct) => correct+1);
    }
    else{
    x.classList.add('incorrect');
    setIncorrect((incorrect) => incorrect+1);
    }

    setTyped((typed)=>(typed+1));
       
  }

   
   return (<>{status && <>  <div className="para container">
                         {flag && (<Timer count={Time} statusUpdate={updateStatus} valAdd={addVal}/>)}
                         <p className="centered-element">
                         {paragraph.map((char,i) =>{
                          return <span id={i} key={i}>{char}</span>;
                          })}
                         </p>
                         </div></>}
                { !(status) && xyz()}
            </>
           );
}
export default TypeZone;