import { useEffect, useState } from "react";

function Admin(){
    const [adminpass, setAdminpass] = useState(localStorage.getItem('adminpass'));
    const [allowed, setAllowed] = useState(false);
    useEffect(()=>{
        if (adminpass !== undefined){
            
        } else {
            setAdminpass(prompt('adminpass?'));
            localStorage.setItem('adminpass', adminpass);
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
    if (!allowed){
        return (
            <>
                not authorized
            </>
        )
    } else {
        return (
            <>
            </>
        )
    }
}
export default Admin;