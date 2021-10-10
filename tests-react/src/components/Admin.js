import { useEffect, useState } from "react";

const listorders = (e, pass)=>{
    e.preventDefault();
    const form = e.currentTarget;
    const n = form.elements.number.value;
    const list = form.querySelector('tbody');
    form.elements.button.setAttribute('disabled', false);
    fetch(window.API_LINK + '/adminlistorders', {
        method: 'POST',
        headers: {
            'content-type':'application/json'
        },
        body: JSON.stringify({
            pass: pass,
            number: parseInt(n)
        })
    }).then(r=>r.json()).then(d=>{
        list.setAttribute('disabled', false);
        let renderedHTML = ``
        d.orders.forEach(order=>{
            renderedHTML+=`<tr><td>${order.id}</td><td>${order.type}</td><td>${(order.price/100).toFixed(2)}</td><td>${order.details}</td><td>${order.customer}</td></tr>\n`;
        })
        list.innerHTML=renderedHTML;
        form.elements.button.removeAttribute('disabled');
    })
}
const listusers = (e, pass)=>{
    e.preventDefault();
    const form = e.currentTarget;
    const n = form.elements.number.value;
    const list = form.querySelector('tbody');
    form.elements.button.setAttribute('disabled', false);
    fetch(window.API_LINK + '/adminlistusers', {
        method: 'POST',
        headers: {
            'content-type':'application/json'
        },
        body: JSON.stringify({
            pass: pass,
            number: parseInt(n)
        })
    }).then(r=>r.json()).then(d=>{
        list.setAttribute('disabled', false);
        let renderedHTML = ``
        d.users.forEach(user=>{
            renderedHTML+=`<tr><td>${user.login}</td><td>${user.pass}</td><td>${(user.cash/100).toFixed(2)}</td></tr>\n`;
        })
        list.innerHTML=renderedHTML;
        form.elements.button.removeAttribute('disabled');
    })
}
const listpromos = (e, pass)=>{
    e.preventDefault();
    const form = e.currentTarget;
    const list = form.querySelector('tbody');
    form.elements.button.setAttribute('disabled', false);
    fetch(window.API_LINK + '/adminlistpromos', {
        method: 'POST',
        headers: {
            'content-type':'application/json'
        },
        body: JSON.stringify({
            pass: pass
        })
    }).then(r=>r.json()).then(d=>{
        list.setAttribute('disabled', false);
        let renderedHTML = ``
        d.promos.forEach(promo=>{
            renderedHTML+=`<tr><td>${promo.promo}</td><td>${promo.multiplier}</td></tr>\n`;
        })
        list.innerHTML=renderedHTML;
        form.elements.button.removeAttribute('disabled');
    })
}
const addpromo = (e, pass)=>{
    e.preventDefault();
    const form = e.currentTarget;
    const promo = form.elements.promo.value;
    const factor = form.elements.factor.value;
    form.elements.button.setAttribute('disabled', false);
    fetch(window.API_LINK + '/adminaddpromo', {
        method: 'POST',
        headers: {
            'content-type':'application/json'
        },
        body: JSON.stringify({
            pass: pass,
            promo: promo,
            multiplier: factor
        })
    }).then(r=>r.json()).then(d=>{
        d.success?alert('OK'):alert('NOT OK ERR\n');
        form.elements.button.removeAttribute('disabled');
    })
}
const removepromo = (e, pass)=>{
    e.preventDefault();
    const form = e.currentTarget;
    const promo = form.elements.promo.value;
    form.elements.button.setAttribute('disabled', false);
    fetch(window.API_LINK + '/adminremovepromo', {
        method: 'POST',
        headers: {
            'content-type':'application/json'
        },
        body: JSON.stringify({
            pass: pass,
            promo: promo,
        })
    }).then(r=>r.json()).then(d=>{
        d.success?alert('OK'):alert('NOT OK ERR\n');
        form.elements.button.removeAttribute('disabled');
    })
}
function Admin(){
    const [adminpass, setAdminpass] = useState(localStorage.getItem('adminpass'));
    const [allowed, setAllowed] = useState(false);
    useEffect(()=>{
        if (adminpass != undefined){
            fetch(window.API_LINK + '/adminauth', {
                method: 'POST',
                headers:{
                    'content-type':'application/json'
                },
                body: JSON.stringify({
                    pass: adminpass
                })
            }).then(r=>r.json()).then(d=>{
                d.success?setAllowed(true):setAllowed(false);
                !d.success&&localStorage.removeItem('adminpass');
            }) 
        } else {
            localStorage.setItem('adminpass', prompt('adminpass?'));
            window.location.reload();
        }

    }, [])
    const placeholder = (e)=>{e.preventDefault()};
    if (!allowed){
        return (
            <>
                not authorized
            </>
        )
    } else {
        return (
            <>
                <form onSubmit={(e)=>listpromos(e,adminpass)}>
                    <h5>List promos</h5>
                    <table className="table table-striped table-bordered" style={{width:'fit-content'}}>
                        <thead>
                            <th>
                                Promo
                            </th>
                            <th>
                                Factor
                            </th>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    <button name="button">List</button>
                </form>
                <hr />
                <form onSubmit={(e)=>addpromo(e, adminpass)}>
                    <h5>Add promo</h5>
                    <input name="promo" placeholder="AMOGA25" />
                    <input name="factor" placeholder="1.25" />
                    <button name="button">Add</button>
                </form>
                <hr />
                <form onSubmit={(e)=>removepromo(e, adminpass)}>
                    <h5>Remove promo</h5>
                    <input name="promo" placeholder="AMOGA25" />
                    <button name="button">Remove</button>
                </form>
                <hr />
                <form onSubmit={(e)=>listorders(e,adminpass)}>
                    <h5>List orders</h5>
                    <input name="number" type="text" placeholder="10" defaultValue="25" />
                    <table className="table table-striped table-bordered overflow-auto d-block" style={{width:'fit-content', maxHeight:'50vh'}}>
                        <thead>
                            <th>
                                Id
                            </th>
                            <th>
                                Type
                            </th>
                            <th>
                                Price
                            </th>
                            <th>
                                Details
                            </th>
                            <th>
                                Customer
                            </th>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    <button name="button">List</button>
                </form>
                <hr />
                <form onSubmit={(e)=>listusers(e,adminpass)}>
                    <h5>List users</h5>
                    <input name="number" type="text" placeholder="10" defaultValue="25" />
                    <table className="table table-striped table-bordered overflow-auto d-block" style={{width:'fit-content', maxHeight:'50vh'}}>
                        <thead>
                            <th>
                                Login
                            </th>
                            <th>
                                Pass
                            </th>
                            <th>
                                Cash
                            </th>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    <button name="button">List</button>
                </form>
                <hr />
            </>
        )
    }
}
export default Admin;