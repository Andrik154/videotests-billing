import logo from './logo.svg';
import './App.css';

import { Link, Route, Redirect, useLocation } from "wouter";
import React, {useEffect, useState} from 'react';

import Testlist from './components/Testlist';
import Signin from './components/Signin';
import Usertest from './components/Usertest';
import Addtest from './components/Addtest';
import Purchase from './components/Purchase';
import Afterlife from './components/Afterlife';

function App() {
  const [location, setLocation] = useLocation();
  const [user,setuser] = useState(JSON.parse(localStorage.getItem('user')));
  const [additionalData,setAdditionalData]=useState({});
  const [cash, setcash]=useState(0);
  const [isLoading, setIsLoading]=useState(true);

  useEffect(async ()=>{
    setIsLoading(true);
    if(!user){
      setIsLoading(false);
    } else {
      await fetch(window.API_LINK+'/getdata',
        {
            method:"post",
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({
                "PHPSESSID":user.PHPSESSID,
                "login":user.login
            })
        }).then(r=>r.json()).then(d=>{
          if (d.success){
            setAdditionalData(Object.assign(additionalData, d.backend));
          } else {
            setuser(null);
            localStorage.removeItem('user');
          }
            
        }).catch((err)=>{
          setuser(null);
          localStorage.removeItem('user');
        })
        await fetch(window.API_LINK+'/getcash',{
          method:"post",
          headers:{
              'content-type':'application/json'
          },
          body:JSON.stringify({
              "PHPSESSID":user.PHPSESSID,
              "login":user.login
          })
        }).then(r=>r.json()).then(d=>{
          setAdditionalData(Object.assign(additionalData, {'cash':d.cash}));
          setcash(d.cash);
        })
        setIsLoading(false);
    }
  },[user])
  if(isLoading){
    return (
      <div className="d-flex mx-auto align-items-center" id="loadscreen">
          <strong>Loading...</strong>
          <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
      </div>
    )
  } else {
    return (
      <div>
        <header className="mt-2 border-bottom">
          <div className="col-12 col-md-10 col-lg-8 d-flex align-items-center mx-auto px-2">
            <Link href="/"><h4 id="logo">TestiKupitOnlain</h4></Link>
            <Link href="/usertests" style={{marginLeft:"30px"}}>Доступные тесты</Link>
            <div style={{"marginLeft":"auto"}}>
                  {user?<span id="acc">{additionalData.pupil.firstname} {cash/100>>0}.{cash%100} RUR<span style={{marginLeft:"8px"}}>(<a href="#" onClick={(e)=>{e.preventDefault();localStorage.removeItem('user'); setLocation('/signin'); setuser(null);}}>Sign out</a>)</span></span>:<Link href="/signin">Войти</Link>}
            </div>
          </div>
        </header> 
        <main>
          <div className="col-12 col-md-10 col-lg-8 mx-auto px-2">
              <Route path="/testlist" component={Testlist} />
              <Route path="/usertests" component={()=> <Usertest user={user} additionalData={additionalData}/>} />
              <Route path="/addtest" component={Addtest}/>
              <Route path="/purchase">{()=>{return (<Redirect to="/usertests"/>)}}</Route>
              <Route path="/purchase/:id">{(p)=>{return (<Purchase id={p.id} user={user} additionalData={additionalData} cash={cash} setcash={setcash}/>)}}</Route>
              <Route path="/signin" component={()=> <Signin setuser={setuser} setAdditionalData={setAdditionalData}/>} />
              <Route path="/afterlife" component={Afterlife} />
          </div>
        </main>
        <footer className="border-top bg-light">
          <div className="col-12 col-md-10 col-lg-8 mx-auto text-black py-2 px-2">
            By <a href="https://vk.com/gluchnosti" target="_blank" className="text-black" style={{textDecoration:"underline", color:"#AAAAAA"}}>gluchnosti</a>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
