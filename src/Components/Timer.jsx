import React,{useEffect, useState ,useRef} from "react";


function Timer(props){

  const [timer, setTimer] = useState(props.count);
  const id = useRef(null);
  const clear=()=>{
  window.clearInterval(id.current)
}
  useEffect(()=>{
     id.current=window.setInterval(()=>{
      setTimer((time)=>time-1);
    },1000)
    return ()=>clear();
  },[])

  useEffect(()=>{
    if(timer===0){
      clear();
      props.statusUpdate();
    }

  },[timer]);

  useEffect(() => {
    if(timer !=props.count && timer>=0)
    props.valAdd(props.count-timer);
  },[timer]);


  return (
    <p className='timer'>{timer}</p>
  );


}

export default Timer;
