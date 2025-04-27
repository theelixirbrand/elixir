import Activity from "../auxfuncs/Activity.tsx";
import { useState, useEffect, useContext } from "react";
import env from "react-dotenv";
import { Link, useNavigate } from "react-router";
import {CompDataContext} from "../App.tsx";


const OjectLoop = ({ param }) => {
    return(
        <>
            <div>
                {Object.entries(param.customer).map(([item, value]) => (
                    <div className="SideBySide" key ={item}>
                        <div>
                            <strong style={{ textTransform: 'capitalize' }}>
                                {item.replace("_", " ")}
                            </strong>
                        </div>

                        <div>
                            <p style={{ textTransform: item !== "email" && 'capitalize' }}>
                                {value}
                            </p>
                        </div>
                    </div>

                ))}
            </div>
        </>
    )
}

const CustomerDetails = ({ param }) => {
    return (
        <>
            <h2>
                User Details
            </h2>
            <hr />
            {
                param.customer !== undefined ?
                    <OjectLoop param = {{'customer' : param.customer}}/>
                    :
                    <Activity />
            }
        </>
    )
}



const OrderDetails = ({ param }) => {
    return (
        <>
            <h2>
                Order Details
            </h2>
            <hr />
            {
                param.orders === undefined ?
                    <Activity /> :
                    <OjectLoop param = {{'customer' : param.orders}}/>


            }
            <span>
            Want to see more details? Head over to your full&nbsp;
            </span>
            <Link to ="/history">
            history page.
            </Link>
        </>
    )
}


const Profile = () => {
    const [profileData, SetPD] = useState(true);
    const globalData = useContext(CompDataContext);

    const navigate = useNavigate();

    useEffect(() => {
        console.log(document.cookie);
        (async function () {
            if(globalData.user === undefined){
                navigate("/auth");
                return;
            }
            let resp = await fetch(env.REACT_APP_BH + '/profile',
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Token " + document.cookie.split("=")[1]
                    }
                }
            );
            console.log(resp.status);
            if (resp.status === 200) {
                const results = await resp.json();
                console.log(results);
                SetPD(results);
                return;
            }
            else if(resp.status === 301){
                alert("An unexpected error has occured. Deleting your cookies might fix this issue.");
                navigate("/auth");
            }
             else {
                alert("An unexpected error has occured.");
            }

        })();

        return;
    }, [globalData]);

    return (
        <>
            <div style={{ minHeight: '90vh' }}>
                <div className="Subhead">
                    <h1 className="centerText">
                        Profile
                    </h1>
                </div>
                {
                    profileData === null ?
                        <Activity /> :
                        <>
                            <CustomerDetails param={{ 'customer': profileData.customer }} />
                            <hr /><hr />
                            <OrderDetails param={{ 'orders': profileData.orders }} />
                        </>
                }
            </div>
        </>
    );
}

export default Profile