import './App.css';
import {Routes , Route } from "react-router-dom"
import TypeZone from './Components/TypeZone';
import Header from './Components/Header';
import Login from './Components/Login';
import Account from './Components/Account';
import Password from './Components/Password';

function App() {  
  return (
    <div className="Appbody ">
    <Header />
    <Routes>
      <Route path='/' element={<TypeZone />} />
      <Route path='login' element={<Login />} />
      <Route path='account' element={<Account />} />
      <Route path='forgotpassword' element={<Password/>} />
    </Routes>
    </div>
  );
}

export default App;
