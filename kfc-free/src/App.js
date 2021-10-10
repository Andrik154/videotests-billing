import { useEffect, useState } from 'react';
import { Switch, Route, Link } from 'wouter';

import './App.css';
import Card from './components/Card';
import Dish from './components/Dish';
import Index from './components/Index';
import Settings from './components/Settings';
import Table from './components/Table';

const getData = () =>{
  return fetch(`https://api.kfc.com/api/menu/api/v1/menu.short/${window.city.id}/website/finger_lickin_good`).then(r=>r.json()).then(d=>{console.log(d); return d});
}
const menuSort = (data) => {
  var menu = {
    computableDishes:{
    },
    categories: [...data.value.categories.main, ...data.value.categories.coupons],
    render:[]
  }

  Object.keys(data.value.products).forEach((key)=>{
    let item = data.value.products[key];
    if(item.type==='Dish' && item.carbs!==undefined && item.volume!==undefined && item.energy!==undefined){
      let m = item.volume.gr || item.volume.ml;
      let mm = Object.keys(item.volume)[0];
      let dish = {
        type: item.type,
        delivery: item.delivery || false,
        inStore: item.inStore || false,
        price: item.price,
        title: item.title,
        descr: item.descr,
        id: item.id,
        composition: item.composition || false,
        image: item.image,
        m: m,
        mm: mm,
        cfp:{
          c: item.carbs.gr,
          f: item.fats.gr,
          p: item.proteins.gr,
          e: item.energy.ccal,
        },
        cfpCalc:{
          c: parseFloat((item.carbs.gr*m/100).toFixed(2)),
          f: parseFloat((item.fats.gr*m/100).toFixed(2)),
          p: parseFloat((item.proteins.gr*m/100).toFixed(2)),
          e: parseFloat((item.energy.ccal*m/100).toFixed(2)),
        },
        epRatio:parseFloat((item.energy.ccal*m/100/(item.price/100)).toFixed(2))
      }
      Object.assign(menu.computableDishes,{[dish.id]:dish});
      menu.render.push(item.id);
    } else if (item.type==='Dish'){
      let dish = {
        type: item.type,
        delivery: item.delivery || false,
        price: item.price,
        title: item.title,
        descr: item.descr,
        id: item.id,
        image: item.image,
        m: 0,
        mm: '',
        cfp: {
          c: 0,
          f: 0,
          p: 0,
          e: 0
        },
        cfpCalc: {
          c: 0,
          f: 0,
          p: 0,
          e: 0
        },
        epRatio:0,
      }
      Object.assign(menu.computableDishes, {[item.id]:dish});
      menu.render.push(item.id);
    }
  })
  Object.keys(data.value.products).forEach((key)=>{
    let item = data.value.products[key];
    if (item.type==='Combo'){
      var consistsOf = [];
      var totalCfp={c:0, f:0, p:0, e:0};
      item.modifierGroups.forEach(mg=>{
        let id = mg.modifiers[0].productId;
        consistsOf.push(id);
        let dish = menu.computableDishes[id] || false;
        if (dish){
          totalCfp.c+=dish.cfpCalc.c;
          totalCfp.f+=dish.cfpCalc.f;
          totalCfp.p+=dish.cfpCalc.p;
          totalCfp.e+=dish.cfpCalc.e;
        }
      })
      let dish = {
        type: item.type,
        delivery: item.delivery || false,
        price: item.price,
        title: item.title,
        descr: item.descr,
        id: item.id,
        composition: item.composition,
        image:item.image,
        consistsOf: consistsOf,
        cfp: totalCfp,
        cfpCalc: totalCfp,
        epRatio: parseFloat((totalCfp.e/(item.price/100)).toFixed(2))
      }
      Object.assign(menu.computableDishes, {[item.id]:dish});
      menu.render.push(item.id);
    }
  })
  menu.render = menu.render.sort((a,b)=>menu.computableDishes[b].epRatio - menu.computableDishes[a].epRatio);
  console.log(menu);
  return menu;
}

function App() {
  const [menu, setMenu]=useState([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState(JSON.parse(localStorage.getItem('filter')) || []);
  useEffect(()=>{
    getData().then((d)=>{
      setMenu(menuSort(d));
      setLoaded(true);
    });
  }, []);
  if (!loaded){
    return (
      <>
        <div>Fetching some data</div>
      </>
    )
  }
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid col-12 col-lg-10 mx-auto">
          <Link className="navbar-brand" href="/">KFCfree</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {/* <li className="nav-item">
                <Link href="/" className="nav-link">Home</Link>
              </li> */}
              <li className="nav-item">
                <Link href="/table" className="nav-link">Table</Link>
              </li>
              <li className="nav-item">
                <Link href="/card" className="nav-link">Card</Link>
              </li>
              <li className="nav-item">
                <Link href="/settings" className="nav-link">Settings</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main className="col-12 col-lg-10 mx-auto mt-3 mb-3 px-3">
        <Switch>
          <Route path="/">
            {()=><Index />}
          </Route>
          <Route path="/table">
            {()=><Table menu={menu} filter={filter} />}
          </Route>
          <Route path="/card">
            {()=><Card menu={menu} filter={filter} />}
          </Route>
          <Route path="/settings">
            {()=><Settings categories={menu.categories} filter={filter} setFilter={setFilter} />}
          </Route>
          <Route path="/dish/:id">
            {(params)=><Dish id={params.id} menu={menu} />}
          </Route>
        </Switch>
      </main>
      <footer className="bg-dark">
        <div className="col-12 col-lg-10 mx-auto my-auto py-2 px-3">
          <span className="text-white">Made by <a href="https://vk.com/gluchnosti" className="text-muted">gluchnosti</a></span>
        </div>
      </footer>
    </div>
  );
}

export default App;
