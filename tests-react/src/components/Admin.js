import { useEffect, useState } from "react";

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
            
        } else {
            localStorage.setItem('adminpass', prompt('adminpass?'));
            window.location.reload();
        }
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
        })
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
                    <span>List promos</span>
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
                <form onSubmit={(e)=>addpromo(e, adminpass)}>
                    <span>Add promo</span>
                    <input name="promo" placeholder="AMOGA25" />
                    <input name="factor" placeholder="1.25" />
                    <button name="button">Add</button>
                </form>
                <form onSubmit={(e)=>removepromo(e, adminpass)}>
                    <span>Remove promo</span>
                    <input name="promo" placeholder="AMOGA25" />
                    <button name="button">Remove</button>
                </form>
            </>
        )
    }
}
export default Admin;