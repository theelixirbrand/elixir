import { useEffect, useState, useContext } from "react";
import env from "react-dotenv";
import { useNavigate, Link } from "react-router";
import Activity from "../auxfuncs/Activity.tsx";
import { AddCommaToNum } from "../auxfuncs/Misc.tsx"
import {CompDataContext} from "../App.tsx";
import {AddToCart} from "../auxfuncs/AddToCart.tsx";



const Total = ({ param }) => {
    return (
        <div style={{ justifyContent: 'space-between', padding: '2vw' }} className="SideBySide">
            <div style={{ justifyContent: "space-between" }} className="SideBySide">
                <div>
                    <p>
                        Grand Total
                    </p>
                </div>
                <div>
                    <b>
                        $ {AddCommaToNum(param['grandTotal'])}
                    </b>
                </div>
            </div>

            <div className="CenterHorizontally">
                <Link className="btn btn-success" to="/check-out">
                    Checkout
                </Link>
            </div>
        </div>
    )
}
const Table = ({ param }) => {
    const params = param;
    const globalData = useContext(CompDataContext);
    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Item</th>
                    <th scope="col"></th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Total</th>
                </tr>
            </thead>
            <tbody className="table-group-divider">
                {params['cartItems'].map((item, index) =>
                    <tr key={index}>
                        <th>
                            <div>
                                <div style={{ display: 'flex' }}>
                                    <div>
                                        <img src={env.REACT_APP_BH + item['picture1']} className="SmallImg" alt={item['picture1']} />
                                    </div>

                                    <div>
                                        <img src={env.REACT_APP_BH + item['picture2']} className="SmallImg" alt={item['picture2']} />
                                    </div>
                                </div>
                            </div>
                        </th>
                        <td>
                            {item['name']}
                            <br />
                            $ {AddCommaToNum(item['price'])}
                        </td>
                        <td>
                            <div className="SideBySide" style={{ alignItems: "center", maxWidth:'25vw' }}>
                                <div className="CenterVertically">
                                    <input className="form form-control" id={"quantity" + index} placeholder={item['quantity']}/>
                                </div>
                                <div className="CenterVertically CenterHorizontally btn btn-primary" onClick = {async ()=>{
                                    globalData.start();
                                    const quantity = document.getElementById("quantity" + index).value;
                                    AddToCart(item['id'], params['SetCartCount'], params['navigate'], quantity, globalData.SetPercent, globalData.clean, globalData.user);
                                }}>
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" stroke="white" strokeWidth="2" width="16" height="16" fill="white" className="bi bi-check-lg" viewBox="0 0 16 16">
                                            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </td>
                        <td>$&nbsp;{AddCommaToNum(item['total'])}</td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}

const Cart = () => {
    
    const [cartData, SetCartData] = useState(null);
    const navigate = useNavigate();
    const globalData = useContext(CompDataContext);
    const SetCartCount = globalData['SetCartCount'];
    useEffect(() => {
        
        (async function () {
            try {

                let resp = await fetch(env.REACT_APP_BH + "/get-cart-data", {
                    method: "GET",
                    headers:
                    {
                        "Authorization": "Token " + document.cookie.split("=")[1]
                    }
                });
                const results = await resp.json();
                console.log(resp.status);
                console.log(results);
                if (resp.status === 200) {
                    SetCartData(results);
                }
                else {
                    navigate(results['path'])
                }
            }
            catch {
                alert("Failed to load cart");
            }

        })();

    }, [globalData.cartCount]);

    return (
        <div>
            <div className="Subhead">
                <div style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>
                    <span>Your cart (</span>
                    {cartData === null ? <Activity /> : cartData['cart']['total_item']}
                    <span>
                        &nbsp;items)
                    </span>
                </div>
            </div>

            {
                cartData === null ? <Activity /> :
                    <>
                        <Table param={{ 'cartItems': cartData['cartItems'], 'SetCartCount' : SetCartCount, 'navigate' : navigate}} />
                        <Total param={{ 'grandTotal': cartData['cart']['total_cost']  }} />
                    </>
            }
        </div>
    )
}

export default Cart