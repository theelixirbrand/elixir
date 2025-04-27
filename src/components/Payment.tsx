import { useParams } from "react-router";
import { useState, useEffect, useContext } from "react";
import Activity from "../auxfuncs/Activity.tsx";
import env from "react-dotenv";
import {AddCommaToNum} from "../auxfuncs/Misc.tsx";
import {CompDataContext} from '../App.tsx';

const Status = ({param})=>{
    console.log(param)
    return (
        <>
        <div className = "CenterHorizontally">
        {
            param.status ? <p className = 'btn btn-success'>Order placed successfully.</p> : <p className = 'btn btn-danger'>Order Failed.</p>
        }
        </div>
        </>
    )
}

const ProcessPayment = (_SetHasPaid, _transID, globalData)=>{
    
    const clean = globalData['clean'];
    
    
    (async function(){
        let resp = await fetch(env.REACT_APP_BH + "/has-paid/" + _transID + '/',
            {
                method: "POST",
                headers: {
                    "Authorization": "Token " + document.cookie.split("=")[1]
                }
            }
        );
        if(resp.status === 200)
        {
            _SetHasPaid(true);
            
        }
        else{
            alert("An unexpected error has occured.");
            
        }
        clean();
    })();
    
    return;
};
const Payment = () => {

    const params = useParams();
    console.log(params);

    const [hasPaid, SetHasPaid] = useState(false);
    const [amount, SetAmount] = useState(null);
    const [wasSuccessful, SetWasSuccessful] = useState(null);
    const globalData = useContext(CompDataContext);

    useEffect(() => {
        (async function () {
            globalData.SetPercent(50);
            let resp = await fetch(env.REACT_APP_BH + "/has-paid/" + params.transID + '/',
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Token " + document.cookie.split("=")[1]
                    }
                }
            );
            console.log("getting resukts");
            const results = await resp.json();
            console.log(results)
            console.log(resp.status)
            if (resp.status === 301) {
                alert("Your session has expired. Sign in again.")
            }
            else if (resp.status === 200) {
                if(results['status'] !== undefined)
                {
                    SetHasPaid(true);
                    SetAmount(results['amount']);
                    SetWasSuccessful(results['status']);
                }
                if (results['hasPaid'])
                {
                    
                    SetHasPaid(true);
                    SetAmount(results['amount']);
                    return;
                }
                SetAmount(results['amount']);
            }
            else {
                alert("An Unexpected Error has occured.");
            }
            console.log(resp.status);
        })();
        globalData.clean();
    }, [params.transID]);

    return (
        <>
            <div className="Subhead">
                <h1 className="centerText">
                    Make Order Payment
                </h1>

            </div>
            <div>
                
                <div className="centerText" style={{fontSize : '1.3em'}}>
                    To Pay: $&nbsp;{amount === null ? <Activity/> : AddCommaToNum(amount) }
                </div>
            </div>
            <hr />

            <div style={{ minHeight: '50vh' }}>

                <p>
                    <b>
                        Accoutn details
                    </b>
                </p>
            </div>

            <div>
                <p>
                    Transfer the exact amount to the account provided.
                </p>
            </div>
            <hr />

            {
                wasSuccessful !== null ? <Status param = {{'status' : wasSuccessful}}/> : 

                !hasPaid ?
                    <div className="CenterVertically" onClick={() => {
                        ProcessPayment(SetHasPaid, params.transID, globalData);
                        globalData.start();
                        globalData.SetPercent(50);
                    }}>
                        <p className="btn btn-primary">
                            I have sent the money
                        </p>
                    </div>
                    :
                    <>
                        <Activity />
                        <br />
                        <p style={{ textAlign: 'center' }}>
                            We're comfirming your payment.
                        </p>
                        <p style={{ textAlign: 'center' }}>
                            You do not need to wait here. You may check the status of your order at any time on your order history page.            </p>
                    </>
            }
        </>
    )

}

export default Payment