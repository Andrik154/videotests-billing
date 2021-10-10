import { useEffect, useState } from "react";

const getCities = ()=>{
  return fetch('https://api.kfc.com/api/store/v2/store.get_cities', {method:'POST'}).then(r=>r.json()).then(d=>{
    var cities = [];
    d.value.cities.forEach(i=>{
      i.defaultStore&&cities.push({
        defaultStore: i.defaultStore.id || false,
        searchstring: Object.keys(i.title).map(l=>i.title[l]).join(''),
        title: i.title['ru']
      });
    })
    return cities;
  })
}
const searchCities = (e, cities, setSCities)=>{
  e.preventDefault();
  let input = e.target.value;
  let sCities = [];
  if (input.length>=2){
    cities.some(e=>{
      if(e.searchstring.toLowerCase().includes(input.toLowerCase())){
        sCities.push({
          title: e.title,
          defaultStore: e.defaultStore
        })
      }
      return sCities.length>4;
    })
    setSCities(sCities);
  }
}
const toggleFilter=(b, banned, sb)=>{
  let i = banned.indexOf(b);
  if (i>-1){
    banned.splice(i, 1);
  } else {
    banned.push(b);
  }
  localStorage.setItem('filter',JSON.stringify(banned));
  sb(banned);
}

function Settings(props){
  const categories = props.categories;
  const setFilter = props.setFilter;
  var filter = props.filter
  const [cities, setCities] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [sCities, setSCities] = useState([]);
  useEffect(()=>{
  getCities().then(cities=>{
    setCities(cities);
    setLoaded(true);
  })
  },[])
  if(!loaded){
    return <>Fetching some data...</>
  }
  return (
    <>
      <h4>Set city</h4>
      <strong>City: </strong><span>{window.city.title}</span><br />
      <input className="col-12 col-md-4" type="text" onChange={(e)=>searchCities(e, cities, setSCities)} placeholder="City..." />
      <ul className="list-group mt-2">
        {
          sCities.length>0?
            <>
              {
              sCities.map((el)=>{
                return <li className="list-group-item d-flex justify-content-between py-0 px-1 col-12 col-md-4">{el.title} <button className="btn-link" onClick={(e)=>{e.preventDefault(); localStorage.setItem('city', JSON.stringify({title:el.title,id:el.defaultStore})); localStorage.setItem('filter', '[]'); window.location.reload()}}>Выбрать</button></li>
              })
              }
            </>
            :
            <></>
        }
      </ul>
      <hr />
      <h4>
        Set filter
      </h4>
      <div className="form-check d-flex flex-wrap">
        {
          categories.map((c)=>{
            return (
              <div className="col-12 col-sm-6 col-md-3" onChange={(e)=>{toggleFilter(c.id, filter, setFilter); console.log(filter)}}>
                <input className="form-check-input" type="checkbox" defaultChecked={!(filter.indexOf(c.id)>-1)} name={c.id} />
                <label className="form-check-label" htmlFor={c.id}>
                  {c.title}
                </label>
              </div>
            )
          })
        }
      </div>
    </>
  )
}

export default Settings;