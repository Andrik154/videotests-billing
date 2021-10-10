import { Link } from 'wouter';

function Index(){
    return (
        <div className="mt-2">
            <h1>Тесты — больше не проблема!</h1>
            <h3>Если есть денежная сумма</h3>
            <div className="d-flex align-items-center">
                <button className="btn btn-outline-light border rounded-10">
                    <Link href="/pay" style={{textDecoration:"none", color:"gray"}}>Пополнить счёт</Link>
                </button>
                <button className="btn btn-outline-light border rounded-10 ms-2">
                    <Link href="/usertests" style={{textDecoration:"none", color:"gray"}}>Тесты на аккаунте</Link>
                </button>
            </div>
            <img src = "./xd.jpg"  width="300" className="mt-2" />
        </div>
    )
}

export default Index;