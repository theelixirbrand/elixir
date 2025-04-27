import { useParams } from "react-router";
import { useEffect, useState, useContext } from "react";
import {CompDataContext} from "../App.tsx";
import env from "react-dotenv";
import Activity from "../auxfuncs/Activity.tsx";
import { AddCommaToNum } from "../auxfuncs/Misc.tsx";

const Details = ({ param }) => {
    console.log(param)
    return (
        <div>
            <h2>
                Order Details
            </h2>
            <hr />

            <div>
                {
                    param.SData === null ? <Activity /> :

                        <div>
                            <div className="SideBySide">
                                <p>
                                    Order ID:
                                </p>
                                <p>
                                    {param.SData['order']['order_id']}
                                </p>
                            </div>

                            <div className="SideBySide">
                                <p>
                                    Total:
                                </p>
                                <p>
                                    $&nbsp;{AddCommaToNum(param.SData['order']['total'])}
                                </p>
                            </div>

                            <div className="SideBySide">
                                <p>
                                    Time:
                                </p>
                                <p>
                                    {new Date(param.SData['order']['time']).toLocaleString()}
                                </p>
                            </div>

                            <div className="SideBySide">
                                <p>
                                    Status:
                                </p>
                                <p>
                                    {!param.SData['order']['hasPaid'] ? "Not Paid" : param.SData['order']['successful'] === null ? "Confirming Payment" : param.SData['order']['successful'] ? "Successful" : "Failed"}
                                </p>
                            </div>
                        </div>


                }
            </div>
        </div>
    )
}


const ItemList = ({ param }) => {
    console.log(param)
    return (
        <div>
            <h2>
                Order Details
            </h2>
            <hr />

            <div>
                {
                    param.SData === null ? <Activity /> :

                        <div>
                            {param.SData['items'].map((item, index) => (
                                <div key={index}>
                                    <div style={{ display: "grid", gridTemplateColumns: "30% 10% 30% 30%" }}>
                                        <div className="CenterVertically" style={{ minHeight: '10vh' }}>
                                            {item['item_name'].trim()}
                                        </div>

                                        <div className="CenterHorizontally CenterVertically" style={{ minHeight: '10vh' }}>
                                            {item['quantity']}
                                        </div>

                                        <div className="CenterHorizontally CenterVertically" style={{ minHeight: '10vh' }}>
                                            $&nbsp;{AddCommaToNum(item['unit_price'])}
                                        </div>

                                        <div className="CenterHorizontally CenterVertically" style={{ minHeight: '10vh' }}>
                                            $&nbsp;{AddCommaToNum(item['total'])}
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                }
            </div>
        </div>
    )
}



const Shipping = ({ param }) => {
    console.log(param)
    return (
        <div>
            <h2>
                Shipping and Contact Info
            </h2>

            <div>
                <hr/>
                {
                    param.SData === null ? <Activity /> :

                        <div>
                            <div className="SideBySide">
                                <p>
                                    Street:
                                </p>
                                <p>
                                    {param.SData['order']['ship_p1']}
                                </p>
                            </div>
                            <div className="SideBySide">
                                <p>
                                    City:
                                </p>
                                <p>
                                    {param.SData['order']['ship_p2']}
                                </p>
                            </div>

                            <div className="SideBySide">
                                <p>
                                    Country:
                                </p>
                                <p>
                                    {param.SData['order']['ship_p3'].split(",")[0]}
                                </p>
                            </div>

                            
                            <div className="SideBySide">
                                <p>
                                    Number:
                                </p>
                                <p>
                                    {param.SData['order']['ship_p3'].split(",")[1]}
                                </p>
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}
const Summary = () => {
    const params = useParams();

    const [SData, SetSData] = useState(null);
    
    const globalData = useContext(CompDataContext);

    useEffect(() => {
        (async function () {
            if(globalData.user === undefined)
            {
                alert("Your session has ezpired");
                return;
            }
            const resp = await fetch(env.REACT_APP_BH + "/summary/" + params.orderID,
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Token " + document.cookie.split("=")[1]
                    }
                }
            );
            if (resp.status === 200) {
                const results = await resp.json();
                SetSData(results);
                console.log(results)
                return;
            }
            else {
                alert("An error has occured.");
            }
        })();
    }, [params.orderID]);

    return (
        <div>
            <div className="Subhead">
                <h1 className="centerText">
                    Order Summary
                </h1>
            </div>

            <Details param={{ 'SData': SData }} />
            <hr /><hr />
            <ItemList param={{ 'SData': SData }} />
            <hr /><hr />
            <Shipping param={{ "SData": SData }} />
        </div>
    )
}

export default Summary