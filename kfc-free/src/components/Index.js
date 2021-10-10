import { Link } from "wouter";

function Index(){
  return (
    <>
    <h1>СТАВЬ ЛАЙК ЕСЛИ</h1>
    <p style={{fontSize:'5px'}}>знаешь все треки моргена наизусть</p>
    <div className="w-100">
    <h4>
      Внимание!
    </h4>
    <p>
      Есть баги с некоторыми купонами по причине в них входят позиции, информация по которым не содержится в меню, так что внимательно изучайте все позиции и обращайте внимание на все
    </p>
    <p>
      Некоторые позиции имеют соотношение ккал/руб равное нулю, так как KFC не предоставили необходимую информацию по позиции
    </p>
    <ul>
      <li><Link href="/table" className="d-inline ml-2">Табличка</Link> - табличный вид</li>
      <li><Link href="/cards" className="d-inline ml-2 mt-2">Карточки</Link> - типо как в интернет-магазине</li>
      <li><Link href="/settings" className="d-inline ml-2 mt-2">Настройки</Link> - настроечки (город, фильтр)</li>
    </ul>
    </div>
    </>
  )
}

export default Index;