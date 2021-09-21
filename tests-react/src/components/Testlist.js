import React, {useEffect, useState} from 'react';

function Testlist(){
    const [isLoading, setLoading] = useState(true);

    const [testlist, setTestlist] = useState({});
    const [selectVal, setSelectVal] = useState(0);

    useEffect(()=>{
        fetch(window.API_LINK+'/gettestlist').then(res=>res.json()).then(data=>{
            let newTestlist = Array.from(testlist).push(data);
           setTestlist(Object.assign(testlist, data));
           setLoading(false);
        })
        console.log(testlist);
    },[])

    if(isLoading){
        return(
            <div>
                Loading data from server...
            </div>
        );
    } else {
        return (
            <div>
                <strong>Choose your grade: </strong>
                <select classList="p-0" name="grade" value={selectVal} onChange={e=>setSelectVal(e.target.value)}>
                    <option value="0">-</option>
                    {Object.keys(testlist).map((grade)=>{
                        return(
                            <option value={grade}>{grade}</option>
                        );
                    })}
                </select>
                {selectVal!=0 && 
                <div className="container-fluid mt-3 px-0">
                        {testlist[selectVal].map((item)=>{
                            console.log(item)
                            return(
                                <div className="row mt-2">
                                    <div className="col-sm-12 col-md-6">
                                        <div className="border rounded p-1">
                                        <strong>{item.name}</strong> <br/>
                                        <strong>Id:</strong> {item.id} <br/>
                                        <strong>Score:</strong> {item.stats} <br/>
                                        <button className="btn btn-success py-0 px-2 m-0">GET IT DONE!!!</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>}
            </div>
        );
    }
}

export default Testlist;