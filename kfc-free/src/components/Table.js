import { Link } from 'wouter';

function Table(props){
  const menu = props.menu;
  const banlist = Array.from(props.filter.map(id=>menu.categories.find(e=>e.id===id).products)).flat();
  return (
    <>
      <strong>City: </strong><span>{window.city.title}</span>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>title</th>
            <th>ccal/rub</th>
            <th>price</th>
          </tr>
        </thead>
        <tbody>
            {
              menu.render.map(i=>{
                let item = menu.computableDishes[i];
                if (banlist.includes(item.id)) return <></>;
                return(
                  <tr>
                    <td>
                    <Link href={`/dish/${item.id}`}>{item.title}</Link>
                    </td>
                    <td>
                      {item.epRatio}
                    </td>
                    <td>
                      {(item.price/100).toFixed(2)}₽
                    </td>
                  </tr>
                )
              })
            }
        </tbody>
      </table> 
    </>
  )
}

export default Table;