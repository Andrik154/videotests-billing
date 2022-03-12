import { Link, Route, Redirect, useLocation, Switch } from "wouter";
import React, {useEffect, useState} from 'react';

import Testlist from './components/Testlist';
import Signin from './components/Signin';
import Usertest from './components/Usertest';
import Addtest from './components/Addtest';
import Purchase from './components/Purchase';
import Afterlife from './components/Afterlife';
import Payment from './components/Payment';
import Success from "./components/Success";
import Err404 from "./components/Err404";
import Index from "./components/Index";

function App() {
  const [location, setLocation] = useLocation();
  const [user,setuser] = useState(JSON.parse(localStorage.getItem('user')));
  const [additionalData,setAdditionalData]=useState({});
  const [cmsData,setCmsData]=useState({});
  const [cash, setcash]=useState(0);
  const [isLoading, setIsLoading]=useState(true);

  useEffect(async ()=>{
    setIsLoading(true);
    await fetch(window.API_LINK+'/getcmscontent', 
      {
        method:'post',
        headers:  {'content-type':'application/json'},
        body:JSON.stringify({
          "id":"index"
        })
      }).then(r=>r.json()).then(d=>{
        if (d.success){
          setCmsData(Object.assign(cmsData,{'index':d.content}));
        }
    })
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
      <div id="App">
        {/* <header className="mt-2 border-bottom">
          <div className="col-12 col-md-10 col-lg-8 d-flex mx-auto align-items-center px-2" id="navitems">
            <Link href="/"><h4 id="logo">TestiKupit</h4></Link>
            <Link href="/usertests" style={{marginLeft:"30px"}}>Тесты</Link>
            <Link href="/pay" style={{marginLeft:"30px"}}>Пополнить</Link>
            <div style={{"marginLeft":"auto"}}>
                  {user?<span id="acc">{additionalData.pupil.firstname} {cash/100>>0}.{cash%100} RUR<span style={{marginLeft:"8px"}}>(<a href="#" onClick={(e)=>{e.preventDefault();localStorage.removeItem('user'); setLocation('/signin'); setuser(null);}}>Выйти</a>)</span></span>:<Link href="/signin">Войти</Link>}
            </div>
          </div>
        </header>  */}
        <div id="ButFooter">
        <header className="bg-dark text-white border-bottom">
          <div className="container-fluid col-12 col-md-10 col-lg-8">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
              <Link href="/"><h4 id="logo" className="mb-0" style={{fontSize:'32px'}}>TestiKi</h4></Link>
              <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 ms-4" style={{fontWeight:700}}>
                <li><Link href="/usertests" style={{textDecoration:'none'}} className="nav-link px-2 text-white">Тесты</Link></li>
                <li><Link href="/pay" style={{textDecoration:'none'}} className="nav-link px-2 text-white">Пополнить</Link></li>
              </ul>
              <div className="text-end">
              {user?<span id="acc">{additionalData.pupil.firstname} {(cash/100).toFixed(2)} RUR<span style={{marginLeft:"8px"}}>(<a href="#" className="text-secondary" onClick={(e)=>{e.preventDefault();localStorage.removeItem('user'); setLocation('/signin'); setuser(null);}}>Выйти</a>)</span></span>:<Link href="/signin" className="text-white">Войти</Link>}
              </div>
            </div>
          </div>
        </header>
        <main>
          <div className="col-12 col-md-10 col-lg-8 mx-auto px-2">
            <Switch>
              <Route path="/" component={()=> <Index cmsData={cmsData} />}/>
              <Route path="/testlist" component={Testlist} />
              <Route path="/usertests" component={()=> <Usertest user={user} additionalData={additionalData}/>} />
              <Route path="/addtest" component={Addtest}/>
              <Route path="/purchase">{()=>{return (<Redirect to="/usertests"/>)}}</Route>
              <Route path="/purchase/:id">{(p)=>{return (<Purchase id={p.id} user={user} additionalData={additionalData} cash={cash} setcash={setcash}/>)}}</Route>
              <Route path="/signin" component={()=> <Signin setuser={setuser} setAdditionalData={setAdditionalData}/>} />
              <Route path="/afterlife" component={Afterlife} />
              <Route path="/pay" component={()=><Payment user={user} additionalData={additionalData} />} />
              <Route path="/success" component={Success} />
              <Route path="" component={Err404} />
            </Switch>
          </div>
        </main>
        </div>
        <footer className="border-top bg-light">
          <div className="col-12 col-md-10 col-lg-8 mx-auto my-auto text-black py-2 px-2 pb-0">
            By <a href="https://vk.com/gluchnosti" target="_blank" className="text-black" style={{textDecoration:"underline", color:"#AAAAAA"}}>gluchnosti</a>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
