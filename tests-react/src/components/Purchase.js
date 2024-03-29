import React, {useState, useEffect} from "react";
import { Redirect, useLocation } from "wouter";

function Purchase(props){
    const [redir, setredir] = useState(props.user&&true);
    const [show, setshow] = useState(false);
    const [test, setTest] = useState(false);
    const [nomoney, setnomoney] = useState(false);
    const [handling, sethandling] = useState(false);
    const [location, setLocation] = useLocation();
    function handlePayment(e){
        if(test>props.additionalData.cash){
            setnomoney(true);
        } else {
            sethandling(true);
            fetch(window.API_LINK + '/purchasetest', {
                method:'POST',
                headers:{
                    'content-type':'application/json'
                },
                body:JSON.stringify({
                    login:props.user.login,
                    pass: props.user.pass,
                    test: props.id
                })
            }).then(r=>r.json()).then(d=>{
                if(d.success){
                    props.setcash(props.cash-test);
                    window.location.href = `${window.location.origin}/tests/afterlife?t=${d.t}`;
                } else {
                    sethandling(false);
                    if(d.fatal){
                        alert('Внимание! Произошла ошибка, при которой возможны нехорошие последствия.\nПосмотрите, начат ли тест, который вы заказывали.\nЕсли да, то ОБЯЗАТЕЛЬНО свяжитесь с близкими к разработчику лицами и объясните проблему');
                    } else {
                        alert('Неудачная попытка, но ничего страшного; попробуйте еще раз');
                    }
                }
            })
        }
    }
    useEffect(()=>{
        console.log(props)
        fetch(window.API_LINK + '/test', {
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body: JSON.stringify({
                id: props.id
            })
        }).then(r=>r.json()).then(d=>{
                if(d.success){
                    if(d.exists){
                        setTest(d.exists);
                        setshow(true);
                    } else {
                        setshow(true);
                    }
                } else {
                    alert('ERROR; reload the page');
                }
            })
    },[])
    if(!redir){
        return <Redirect to="/signin" />
    } else if(show){
        if(!test){
            return (
            <div>
                <div className="col-12 mt-2">
                    <p><strong>Account: </strong>{props.additionalData.pupil.firstname} {props.additionalData.pupil.lastname}</p>
                    <p><strong>Test: </strong>{(()=>{
                        let test = props.additionalData.pupil.tests.find(i=>i.test.fakeId==props.id);
                        return `${test.test.orderVal}. ${test.test.title}`
                    })()}</p>
                    <p><strong>Unfortunately, the test is not in database yet. Come back later!</strong></p>
                </div>
            </div>
            )
        } else {
            return (
                <div>
                    <div className="col-12 mt-2">
                        <span color="red" hidden={!nomoney}><strong>You don't have enough money!</strong></span>
                        <p><strong>Account: </strong>{props.additionalData.pupil.firstname} {props.additionalData.pupil.lastname}</p>
                        <p><strong>Test: </strong>{(()=>{
                            let test = props.additionalData.pupil.tests.find(i=>i.test.fakeId==props.id);
                            return <>{test.test.orderVal}. {test.test.title}</>
                        })()}</p>
                        <p><strong>Balance: </strong>{(props.cash/100).toFixed(2)} RUR</p>
                        <p><strong>Price: </strong>{(test/100).toFixed(2)} RUR</p>
                        <div className="d-flex align-items-center mt-2">
                            <button className="btn button-33 py-1 px-3 w-50 h-100 d-block" disabled={props.additionalData.cash<test} disabled={handling} onClick={handlePayment}>Confirm order</button>
                            <div className="mx-3" hidden={!handling}>
                                <div class="spinner-border" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    } else {
        return (<div>Fetching some data...</div>)
    }
}

export default Purchase;