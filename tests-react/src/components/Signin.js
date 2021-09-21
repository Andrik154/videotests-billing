import React, {useState, useEffect} from "react";
import useLocation from "wouter/use-location";

function Signin(props){
    const [toggleblock, settoggleblock] = useState(false);
    const [nosuccess, setnosuccess] = useState(false);
    const [savedcreds, setsavedcreds] = useState(JSON.parse(localStorage.getItem('credentials')));
    const [location, setLocation] = useLocation();

    function signin(e){
        e.preventDefault();
        let form = e.target;
        settoggleblock(true);
        let login = form.elements.inputLogin.value;
        let pass = form.elements.inputPass.value;
        fetch(window.API_LINK+"/signin", {
            method:"POST",
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({
                "pupil":{
                    "login":login,
                    "pass":pass
                }
            })
        }).then(r=>r.json()).then(d=>{
            if (d.success){
                setnosuccess(false);
                let storageData = {
                    "login":login,
                    "pass":pass,
                    "PHPSESSID":d.PHPSESSID
                }
                fetch(window.API_LINK+'/getdata',
                {
                    method:"post",
                    headers:{
                        'content-type':'application/json'
                    },
                    body:JSON.stringify({
                        "PHPSESSID":storageData.PHPSESSID,
                        "login":storageData.login
                    })
                }).then(r=>r.json()).then(d=>{
                    if (d.success){ 
                        if(form.elements.save.checked){
                            savedcreds?localStorage.setItem('credentials',JSON.stringify([login, pass])):localStorage.setItem('credentials',JSON.stringify([login, pass]));
                            setsavedcreds(JSON.parse(localStorage.getItem('credentials')));
                        }
                        props.setAdditionalData(Object.assign(d.backend));
                        localStorage.setItem('user',JSON.stringify(storageData));
                        props.setuser(storageData);
                        settoggleblock(false);
                        setLocation('/');
                    } else {
                        setnosuccess(true);
                        settoggleblock(false); 
                    }
                })

            } else {
                setnosuccess(true);
                settoggleblock(false);  
            }
        })
    }
    
    return(
        <div className="col-12 col-md-5 rounded mx-auto mt-5 border rounded-0">
            <div className="border-bottom mb-1 px-3 pt-2 bg-light">
                <h5>Вход</h5>
            </div>
            <form onSubmit={signin} className="px-3 py-2">
                <div className="row text-danger mb-2" hidden={!nosuccess}>
                    <div className="col-sm-12">
                        Неверный логин/пароль
                    </div>
                </div>
                <div className="row">
                    <label for="inputLogin" className="col-4 col-form-label">Логин</label>
                    <div className="col-8">
                        <input name="inputLogin" type="text" placeholder="2281488" className="w-100" defaultValue={savedcreds&&savedcreds[0]} disabled={toggleblock} required/>
                    </div>
                </div>
                <div className="row">
                    <label for="inputPass" className="col-4 col-form-label">Пароль</label>
                    <div className="col-8">
                        <input name="inputPass" type="text" placeholder="3ad6" className="w-100" defaultValue={savedcreds&&savedcreds[1]} disabled={toggleblock} required/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                    </div>
                    <div className="col-8">
                        <div className="form-check">
                            <input class="form-check-input" type="checkbox" name="save" value/>
                            <label class="form-check-label" for="save">
                                Сохранить реквизиты
                            </label>
                        </div>
                    </div>
                </div>
                <div className="d-flex align-items-center mt-2">
                    <button name="submit" type="submit" class="btn btn-primary" disabled={toggleblock}>Войти</button>
                    <div className="mx-3" hidden={!toggleblock}>
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Signin;