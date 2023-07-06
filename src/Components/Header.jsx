import React from 'react';
import avs from '../images/ava.png';
import {useNavigate} from 'react-router-dom';
import {auth} from '../config/firebase'
import {onAuthStateChanged} from 'firebase/auth';



function Header (){
    const navigate = useNavigate();
    var flag=true;

    const direct = () => {
        onAuthStateChanged(auth , (currentUser) => {
            if(currentUser && flag){
                navigate('/account');
                flag=false;
            }
            else{
                navigate('/login');
            }
          });

    }
 
    return (
        <header className='titlebox'>
        <h1 className='title' onClick={() => navigate('/')}>Dumb Type</h1>
        <img src={avs} alt='login' onClick={direct}></img>
        </header>
    );
}

export default Header;