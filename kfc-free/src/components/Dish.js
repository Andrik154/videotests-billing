
function Dish(params){
  const id = params.id;
  const menu = params.menu;
  const dish = menu.computableDishes[id];
  if(dish.type==='Dish'){
    return (
      <div className="row">
        <div className="col-12 col-md-6">
          <img src={`${window.CDN_PREFIX}295x0/${dish.image}`} alt={dish.title} style={{maxHeight:'30vh'}}></img>
          <h4><strong>{dish.title}</strong></h4>
        </div>
        <div className="col-12 col-md-6">
          <h5>Описание товара:</h5>
          <p>{dish.descr}</p>
          <p><strong>Масса/Объем:</strong> {dish.m} {dish.mm}</p>
          <h5>КБЖУ (рассчитано)</h5> 
          <table className="table table-bordered w-50">
            <thead>
              <tr>
                <th>К</th>
                <th>Б</th>
                <th>Ж</th>
                <th>У</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{dish.cfpCalc.e} ккал</td>
                <td>{dish.cfpCalc.p} г</td>
                <td>{dish.cfpCalc.f} г</td>
                <td>{dish.cfpCalc.c} г</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  } else if (dish.type==='Combo'){
    return (
      <div className="row">
        <div className="col-12 col-md-6">
          <img src={`${window.CDN_PREFIX}295x0/${dish.image}`} alt={dish.title} style={{maxHeight:'30vh'}}></img>
          <h4><strong>{dish.title}</strong></h4>
        </div>
        <div className="col-12 col-md-6">
          <h5>Описание товара:</h5>
          <p>{dish.descr}</p>
          <h5>КБЖУ (рассчитано, неточно)</h5> 
          <table className="table table-bordered w-50">
            <thead>
              <tr>
                <th>К</th>
                <th>Б</th>
                <th>Ж</th>
                <th>У</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{dish.cfp.e} ккал</td>
                <td>{dish.cfp.p} г</td>
                <td>{dish.cfp.f} г</td>
                <td>{dish.cfp.c} г</td>
              </tr>
            </tbody>
          </table>
          <h5>Рассчитано используя:</h5>
          <ul>
            {
              dish.consistsOf.map(i=>{
                let d = menu.computableDishes[i] || false;
                if (!d) return <></>;
                return (
                  <li>{d.title} - {d.cfpCalc.e} ccal</li>
                )
              })
            }
          </ul>
        </div>
      </div>
    )
  }
}

export default Dish;