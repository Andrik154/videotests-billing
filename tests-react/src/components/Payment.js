import { useState, useRef } from "react"
import { useLocation, Redirect } from "wouter";

const errorsList = {
    "nan":{
        text:"Введённая сумма должна быть числом!",
    },
    "empty":{
        text:"Введите сумму!",
    },
    "badPromo":{
        text:"Промокод не существует",
    }
}
function Payment(props){
    const [location, setLocation] = useLocation();
    const [show, setshow] = useState(props.user&&true);
    const handlePayment = (e)=>{
        e.preventDefault();
        const dateHandler = (d)=>`${d.getFullYear()}-${d.getMonth()<10?`0${d.getMonth()}`:d.getMonth()}-${d.getDate()<10?`0${d.getDate()}`:d.getDate()}Т${d.getHours()<10?`0${d.getHours()}`:d.getHours()}${d.getMinutes()<10?`0${d.getMinutes()}`:d.getMinutes()}`
        const payload = {
            publicKey:"48e7qUxn9T7RyYE1MVZswX1FRSbE6iyCj2gCRwwF3Dnh5XrasNTx3BGPiMsyXQFNKQhvukniQG8RTVhYm3iPv6GW1dNY2axMhQYJVgqd3ZZWtm2qa9DTWve4GtjW1NwUBCZm7u6TuSmpuUdjE5hyJNKrwVJt8mQbJGtX2j8LoPmvL9M7uRdj4pwWtUVDp",
            amount: ui.toFixed(2),
            account: encodeURIComponent(props.user.login),
            customFields: {
                promo: encodeURIComponent(checkedPromo.text),
                themeCode: "Andrei-LLlD4scgVW"
            },
            lifetime: `${dateHandler(new Date(Date.now()+25*60e3))}`,
            successUrl: `${window.location.origin}/tests/success?amount=${(ui*checkedPromo.multiplier).toFixed(2)}`
        }
        const {customFields, ...restP} = payload;
        const qsp = new URLSearchParams({...restP});
        const url = `https://oplata.qiwi.com/create?${qsp.toString()}&customFields[promo]=${customFields.promo}&customFields[themeCode]=${customFields.themeCode}`;
        window.location.href = url;
    }
    const handleForm = (e)=>{
        var errors = [];
        const ui = form.current.elements.inputSum.value;
        const promo = form.current.elements.inputPromo.value;

        const uiStatus = handleUi(ui);
        const promoStatus = promoEvent(promo);
        switch (uiStatus){
            case 0:
                setUi(parseFloat(ui));
                break;
            case 1:
                errors.push("empty");
                setUi(0);
                break;
            case 2:
                errors.push("nan");
                setUi(0);
                break;
            case 3:
                errors.push("empty");
                setUi(0);
                break;
        }
        switch(promoStatus){
            case 0:
                setMultiplier(checkedPromo.multiplier);
                setNewPromo(false);
                break;
            case 1:
                setMultiplier(1.0);
                setNewPromo(promo)
                break;
        }
        if(uiStatus===0 && promoStatus===0){
            setReady(true);
        } else {
            setReady(false);
        }
        setErrors(errors);
    }
    const handleUi = (i)=>{
        if(isNaN(i)){
            return 2;
        } else if (i==""){
            return 1;
        } else if (parseFloat(i)==0){
            return 3;
        }  else {
            return 0;
        }
    }
    const promoEvent = (promo)=>{
        if (promo==checkedPromo.text){
            return 0;
        } else {
            return 1;
        }
    }
    const handlePromo = (e)=>{
        e.preventDefault();
        const promo = newPromo;
        setHandling(true);
        fetch(window.API_LINK + '/promo', {
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body: JSON.stringify({
                promo: promo
            })
        }).then(r=>r.json()).then(d=>{
            setHandling(false);
            if (!d.success){
                alert('Something bad happened; try again')
            } else {
                if(d.goodPromo){
                    setNewPromo(false);
                    setCheckedPromo({
                        text: promo,
                        multiplier: d.multiplier
                    })
                    setMultiplier(d.multiplier);
                    if(errors.length==0){
                        setReady(true);
                    }
                } else {
                    errors.push("badPromo")
                    setErrors(errors);
                    setMultiplier(1.0);
                    setCheckedPromo({text:"", multiplier:1.0});
                }
            }
        }).catch(e=>alert(`Something bad happened, try again; ${e}`))
    }
    const [ui, setUi] = useState(150);
    const [multiplier, setMultiplier] = useState(1.0);
    const [ready, setReady] = useState(true);
    const [newPromo, setNewPromo] = useState(false);
    const [checkedPromo, setCheckedPromo] = useState({text:"", multiplier:1.0});
    const [handling, setHandling] = useState(false);
    const form = useRef(null);
    var [errors, setErrors]  = useState([]);

    if(!show){
        return <Redirect to="/signin"/>
    }
    return (
        <div className="col-12 col-md-5 mx-auto mt-5 border">  
            <div className="border-bottom mb-1 px-3 pt-2 bg-light">
                <h5>Пополнить счёт</h5>
            </div>
            <form  className="px-3 py-2" ref={form} onSubmit={(e)=>{e.preventDefault()}} onChange={handleForm}>
                {
                    errors.map((key)=><div className="row text-danger mb-1"><div className="col-12">{errorsList[key].text}</div></div>)
                }
                <div className="row align-items-center">
                    <label for="inputSum" className="col-4 col-form-label">Сумма*</label>
                    <div className="col-8">
                        <input name="inputSum" type="number" step="15.0" min="0" placeholder="150.00" className="w-100" defaultValue={ui} required/>
                    </div>
                </div>
                <div className="row align-items-center">
                    <label for="inputPromo" className="col-4 col-form-label">Промокод</label>
                    <div className="col-8">
                        <input name="inputPromo" type="text" placeholder="AMOGA25" className="w-100"/>
                    </div>
                </div>
                <div className="row align-items-center">
                    <label for="inputTotal" className="col-4 col-form-label">Итого:</label>
                    <div className="col-8">
                        <input name="inputTotal" type="text" placeholder="123.0" className="w-100"  value={`${ui*multiplier} RUR`} disabled/>
                    </div>
                </div>
                <div className="d-flex align-items-center mt-2">
                    <button name="submit" type="submit" class="btn btn-primary" onClick={handlePayment} disabled={!ready}>Пополнить</button>
                    <button name="submit" type="" class="btn btn-outline-primary ms-2" onClick={handlePromo} disabled={!newPromo}>Проверить промо</button>
                    <div className="mx-3" >
                        <div class="spinner-border" role="status" hidden={!handling}>
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Payment;