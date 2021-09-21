import React, {useEffect, useState} from 'react';
import { Redirect, useLocation, useRoute } from 'wouter';

function Usertest(props){
    const [location, setLocation] = useLocation();
    const [show, setshow] = useState(props.user&&true);

    if(show){
        return(
            <div style={{height:"80vh"}}>
                {/* <div className="container-fluid mt-3 px-0">
                        {props.additionalData.pupil.tests.map((item)=>{
                            console.log(item)
                            return(
                                <div className="row">
                                    <div className="col-sm-12 col-md-6">
                                        <div className="border-bottom rounded-0 p-2 py-4">
                                        <strong>{item.test.title}</strong> <br/>
                                        <strong>Id:</strong> {item.test.fakeId} <br/>
                                        {
                                            item.compliteCount==0?
                                                <button className="btn btn-outline-success py-0 px-2 m-0 rounded-0 w-50 mt-1" onClick={()=>setLocation(`/purchase/${item.test.fakeId}`)}>Purchase test</button>
                                                :
                                                <button className="btn btn-outline-secondary py-0 px-2 m-0 rounded-0 w-50 mt-1" disabled={true}>Completed</button>

                                        }
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div> */}
                <div className="col-12 overflow-auto mt-2" style={{maxHeight:"100%"}}>
                {props.additionalData.pupil.tests.map((item)=>{
                            console.log(item)
                            return(
                                <div className="">
                                    <div className="col-12">
                                        <div className="border-bottom rounded-0 p-2 pt-1 py-3">
                                        <strong>{item.test.title}</strong> <br/>
                                        <strong>Id:</strong> {item.test.fakeId} <br/>
                                        {
                                            item.compliteCount==0?
                                                <button className="btn btn-outline-success py-0 px-2 m-0 rounded-0 w-50 mt-1" onClick={()=>setLocation(`/purchase/${item.test.fakeId}`)}>Purchase test</button>
                                                :
                                                <button className="btn btn-outline-secondary py-0 px-2 m-0 rounded-0 w-50 mt-1" disabled={true}>Completed</button>

                                        }
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        )
    } else {
        return(
            <div>
                <Redirect to="/signin"/>
            </div>
        )
    }
}

export default Usertest;