function Addtest(){
    function send(e){
        e.preventDefault();
        let f= e.target;
        let payload = {
            "pass": f.elements.pass.value,
            "id": f.elements.id.value,
            "answers": f.elements.answers.value,
            "questions": f.elements.questions.value,
            "price": f.elements.price.value
        }

        fetch (window.API_LINK + '/addtest', {
            method: "POST",
            headers:{
                "content-type":"application/json"
            },
            body: JSON.stringify(payload)
        }).then(r=>r.json()).then(d=>{d.success?alert('OK'):alert('something WENT VERY WRONG')}).catch(e=>alert(`err: ${e}`));
    }
    return(
        <div>
            <form onSubmit={send}>
            <input type="text" placeholder="pass" name="pass"></input> <br/>
            <input type="text" placeholder="test id" name="id"></input> <br/>
            <input type="text" placeholder="answers" name="answers"></input> <br/>
            <input type="text" placeholder="questions" name="questions"></input> <br/>
            <input type="text" placeholder="price (В КОПЕЙКАХ РУБЛИ*100)" name="price"></input> <br/>
            <button>send</button>
            </form>
        </div>
    )
}

export default Addtest;