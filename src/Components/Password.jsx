import React, { useState } from 'react'
import {auth} from '../config/firebase';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const Password = () => {
  const [status , setStatus] = useState(true);
  const [email , setEmail]=useState("");
  
  const changeStatus = () =>{
    if(email!==""){
        sendPasswordResetEmail(auth, email)
        .then(() => {
          console.log("sent");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });  
        setStatus(false);
    }

  };


  return (
    <>{status && <><div className='fg'>
      <form>
      <p id='info'>Enter email affilated to your account</p>
      <input id='fge' type='email' placeholder='express@gmail.com' onChange={(e) => setEmail(e.target.value)}required/>
      <input className='fgp' type='submit' value='submit' onClick={changeStatus}/>
      </form>
     </div></>}
     {!status && <><div className='fg'>      
      <p id='info'>Passowrd reset mail is sent to the respective mail if an account is present</p>
      <p id ='info' className='red'>Check email and retry in case of anomaly</p>
     </div></>}
   </>
  )
}

export default Password