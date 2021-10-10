import { Link } from "wouter";

function Card(props){
  const menu = props.menu;
  const banlist = Array.from(props.filter.map(id=>menu.categories.find(e=>e.id===id).products)).flat();
  return (
    <>
      <strong>City: </strong><span>{window.city.title}</span>
      <div className="d-flex flex-wrap w-100 mt-3" style={{}}>
        {
          menu.render.map(i=>{
            let item = menu.computableDishes[i];
            if (banlist.includes(item.id)) return <></>;
            return(
              <div className="card mb-2 me-auto foodcard">
                {/* <div className="card-header">
                  {item.title}
                </div> */}
                <div className="card-body bg-light">
                  <h6 className="card-title">
                    {item.title}
                  </h6>
                  <p className="card-text">
                    {/* {item.descr} */}
                  </p>
                </div>
                <img data-src={`${window.CDN_PREFIX}/${item.image}`} id={`img${item.id}`} className="card-img-top border-top my-auto" alt={item.title} hidden></img>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <div className="row">
                        <div className="col-6 text-start"><strong>Ccal/RUB ratio:</strong></div>
                        <div className="col-6 text-start">{item.epRatio}</div>
                      </div>
                    </li>                    
                    <li className="list-group-item">
                      <div className="row">
                        <div className="col-6 text-start"><strong>Volume</strong></div>
                        <div className="col-6 text-start">{item.type==='Dish'?`${item.m} ${item.mm}`:'-'}</div>
                      </div>
                    </li>                    
                    <li className="list-group-item">
                      <div className="row">
                        <div className="col-6 text-start"><strong>Price:</strong></div>
                        <div className="col-6 text-start">{(item.price/100).toFixed(2)}₽</div>
                      </div>
                    </li>
                    <li className="list-group-item">
                      <div className="row">
                        <div className="col-12"><button className="btn-link" onClick={(e)=>{e.preventDefault(); let img = document.querySelector(`#img${item.id}`); img.setAttribute('src', img.getAttribute('data-src')); img.removeAttribute('hidden')}}>Показать фото</button></div>
                      </div>
                    </li>
                </ul>
                <div className="px-3 py-2">
                  <Link href={`/dish/${item.id}`} className="btn btn-primary">Узнать больше</Link>
                </div>
              </div>
            )
          })
        }
        </div>
    </>
  )
}

export default Card;