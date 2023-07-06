import React, { useEffect, useState } from 'react'
import {auth , googleProvider} from '../config/firebase';
import {createUserWithEmailAndPassword ,signInWithEmailAndPassword ,signInWithPopup  ,onAuthStateChanged,sendEmailVerification} from 'firebase/auth'
import {db} from '../config/firebase';
import {useNavigate , Link} from 'react-router-dom';
import { collection, getDocs, where , query , Timestamp , addDoc} from 'firebase/firestore';
import AnimateOnLoad from './AnimateOnLoad';



const Login = () => {
  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");
  const [username , setUserName] = useState("");
  const [semail , setSEmail] = useState("");
  const [spassword , setSpassword] = useState("");
  const obj={
    name:null,
    email:null,
    testStarted:0,
    testComp:0,
    join:null,
    maxspeed:{
      wpm:0,
      raw:0,
      accuracy:0,
      arWpm:[],
      arRaw:[],
      totalChar:0,
      totalCorrect:0,
      totalMiss:0,
      uid:null
    }
  };
  const userCollectionRef = collection(db,"Users");
  const [state ,setState] = useState(false);

 
  const navigate = useNavigate();
  var flag = true,flag1=true;
  
  useEffect(()=>{
    onAuthStateChanged(auth , (currentUser) => {
      if(currentUser && flag){
          console.log(currentUser);
          navigate('/');
          flag=false;
          setState(false);
      }
      else{
       setState(true);
      }
    });
  } ,[]);
  
  const getUserData = async () =>{
      try{
        flag1=false;
        const q = query(userCollectionRef , where("email" , "==" ,auth.currentUser.email));
        const userData = await getDocs(q);
        if(userData.docs.length==0 && auth.currentUser){
          obj.name=((username!==null)?username:auth.currentUser.displayName);
          obj.email=auth.currentUser.email;
          obj.join=new Date().toUTCString().slice(5, 16);
          obj.uid = auth.currentUser.uid;
          await addDoc(userCollectionRef , obj);
        }
        else{
          console.log("User is present in firestore");
        }
      } catch (err){
        console.log(err);
      }
    }

  

 const signUp = async () => {
      try{
          await createUserWithEmailAndPassword( auth , semail , spassword);
          await sendEmailVerification(auth.currentUser);
          getUserData();
      } catch(err) {
        console.log("email id already in use");
      }
 };

 const signInWithGoogle = async () => {
  try{
    await signInWithPopup( auth , googleProvider);
    await sendEmailVerification(auth.currentUser);
    getUserData();
    } catch(err) {
      console.error(err);
    }
 };

 const signIn = async () =>{
  await signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    console.log("singned in");
    getUserData();
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  })
 };



  return (<> {state && (<div className='log'>
              <form className='loginpg'>
               <h3>login</h3>
                <input type='email' name='email' placeholder='email' 
                onChange = {(e) => setEmail(e.target.value)} required/>

                <input type='password' name='password' placeholder='password' 
                onChange= {(e) => setPassword(e.target.value)} required/>
                <button type="button" className="login-with-rgister-btn" onClick={signIn}>Sign in</button>
                <span className='keepme'> or </span>
                <button type="button" className="login-with-google-btn" onClick={signInWithGoogle}>Sign in with Google</button>
                <a href="/forgotpassword" className='forgot'>forgot password ?</a>
            </form>
            <form className='singuppg'>
             <h3>register</h3>
             <input type='text' name='username' placeholder='username'
              onChange = {(e) => setUserName(e.target.value)} required/>

             <input type='email' name='email' placeholder='email' 
              onChange = {(e) => setSEmail(e.target.value)} required/>

             <input type='password' name='password' placeholder='password' 
              onChange = {(e) => setSpassword(e.target.value)} required/>

             <button type="button" className="login-with-rgister-btn" onClick={signUp}>Sign up</button>
          </form>
            </div>)}
            {!state && <AnimateOnLoad/>}
          </>);
}

export default Login;

{/* <button type="button" className="login-with-google-btn" >
  Sign in with Google
</button> */}