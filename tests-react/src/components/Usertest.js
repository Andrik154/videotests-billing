import React, {useState} from 'react';
import { Redirect, useLocation} from 'wouter';

function Usertest(props){
    const [location, setLocation] = useLocation();
    const [show, setshow] = useState(props.user&&true);

    if(show){
        return(
            <div style={{}}>
                <div className="col-12 overflow-auto mt-2" style={{maxHeight:"75vh"}}>
                {props.additionalData.pupil.tests.map((item)=>{
                            console.log(item)
                            return (
                                item.incomplite!==null
                                ?
                                    <>
                                    <div className="col-12">
                                        <div className="border-bottom rounded-0 p-2 pt-1 py-3">
                                            <strong>{item.test.orderVal}. {item.test.title}</strong> <br/>
                                            <strong>Id:</strong> {item.test.fakeId} <br/>
                                            <button className="btn button-34 responsivebtn py-0 m-0 w-25 mt-1" disabled={true}>Выполняется</button>
                                        </div>
                                    </div>
                                    </>
                                :
                                    item.compliteCount==0
                                    ?
                                        <>
                                        <div className="col-12">
                                            <div className="border-bottom rounded-0 p-2 pt-1 py-3">
                                            <strong>{item.test.orderVal}. {item.test.title}</strong> <br/>
                                            <strong>Id:</strong> {item.test.fakeId} <br/>
                                            <button className="btn button-33 responsivebtn py-0 px-2 m-0 w-25 mt-1" onClick={()=>setLocation(`/purchase/${item.test.fakeId}`)}>Заказать</button>
                                            </div>
                                        </div>
                                        </>
                                    :
                                    <>
                                        <div className="col-12">
                                            <div className="border-bottom rounded-0 p-2 pt-1 py-3">
                                            <strong>{item.test.orderVal}. {item.test.title}</strong> <br/>
                                            <strong>Id:</strong> {item.test.fakeId} <br/>
                                            <a href={`https://videouroki.net/tests/complete/${item.lastMemberId}`} target="_blank" className='color-34'>Узнать оценку</a> <br/>
                                            <div className="progress w-25 mt-1" style={{borderRadius:'100px'}}>
                                                <div className="progress-bar progress-33" role="progressbar" style={{width:`${item.bestPercent}%`, fontSize:"1.2em"}} aria-valuenow={item.bestPercent} aria-valuemax="100" aria-valuemin="0"  ><strong>{item.bestPercent}%</strong></div>
                                            </div>
                                            {/* <button className="btn btn-dark py-0 px-2 m-0 rounded-25 w-50 mt-1" disabled={true}>Выполнен</button> */}
                                            </div>
                                        </div>
                                    </>
                            );
                        })}
                </div>
            </div>
        )
    } else {
        return(
            <>
                <Redirect to="/signin"/>
            </>
        )
    }
}

export default Usertest;