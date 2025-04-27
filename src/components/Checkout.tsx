import { useState, useRef, useContext, useEffect } from "react";
import Activity from "../auxfuncs/Activity.tsx";
import { useNavigate } from "react-router";
import env from "react-dotenv";
import { AddCommaToNum } from "../auxfuncs/Misc.tsx";
import { CompDataContext } from '../App.tsx';

const ProceedToPay = (checkout, navigate, globalData) => {
    
    
    try {
        
        const form = checkout.current;
        const checkField = Array.from(form).find((item) => {
            return item.name === "selectedShipping" && item.checked;
        });
        globalData.start();
        globalData.SetPercent(40)
        const _tfid = checkField.value;

        (async function () {
            const resp = await fetch(env.REACT_APP_BH + "/payment/" + _tfid,
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Token " + document.cookie.split("=")[1],
                        "Content-Type": "application/json"
                    }
                }
            );
            const results = await resp.json();
            if (resp.status === 200) {
                navigate("/payment/" + results['order_id']);
                
            }
            else if (resp.status === 301) {
                navigate(results['path']);
                
            }
            else {
                alert("Unexpected error has occured.");
            }
        })();
    }
    catch (error) {

        alert("Invalid Shipping Details. Create or select a valid address.");
        globalData.clean();
    }
    return;
};

const Summary = ({ param }) => {
    return (
        <>
            <div>
                <b className="AddressCountry">
                    <p>
                        Order Summary
                    </p>
                </b>
            </div>

            <div className="SideBySide">
                <div>
                    <span>
                        Subtotal
                    </span>
                </div>

                <div>
                    <span>
                        $&nbsp;{AddCommaToNum(param.CData.customer_cart['total_cost'])}
                    </span>
                </div>
            </div>

            <div className="SideBySide">
                <div>
                    <span>
                        Taxes
                    </span>
                </div>

                <div>
                    <span>
                        $&nbsp;{AddCommaToNum(param.CData.customer_cart['total_cost'] / 200)}
                    </span>
                </div>
            </div>


            <div className="SideBySide">
                <div>
                    <span>
                        Total
                    </span>
                </div>

                <div>
                    <span>
                        $&nbsp;{AddCommaToNum((param.CData.customer_cart['total_cost'] / 200) + param.CData.customer_cart['total_cost'])}
                    </span>
                </div>
            </div>

            <hr />
            <div className="CenterHorizontally">
                <div style={{ textAlign: 'center' }} className="btn btn-success" onClick={() => {
                    ProceedToPay(param.checkout, param.navigate, param.globalData);
                }}>
                    Complete Purchase
                </div>
            </div>
        </>
    )
}

const Shipping = ({ param }) => {
    const SubmitShippingAddress = () => {
        (async function () {
            const form = new FormData(param.newShipment.current);
            param.globalData.SetPercent(40);

            try {
                const resp = await fetch(env.REACT_APP_BH + '/create-shipping/create/',
                    {
                        method: "POST",
                        headers: {
                            "Authorization": "Token " + document.cookie.split("=")[1]
                        },
                        body: form
                    }
                )
                const results = await resp.json();

                if (resp.status === 200) {
                    param.SetCData(prevData => ({
                        ...prevData,
                        shipping: results['shipping']
                    }));
                    param.newShipment.current.reset();
                }
            }
            catch (error) {
                console.log(error);
            }
            param.globalData.clean();
        })();
    }

    const DeleteShippingAddress = (_id) => {
        param.globalData.SetPercent(40);
        (async function () {
            const resp = await fetch(env.REACT_APP_BH + '/create-shipping/delete/',
                {
                    method: "POST",
                    headers: {
                        "Authorization": "Token " + document.cookie.split("=")[1],
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ "id": _id })
                });
            const results = await resp.json();
            if (resp.status === 200) {
                param.SetCData(prevData => ({
                    ...prevData,
                    shipping: results['shipping']
                }));
            }
            else if (resp.status === 301) {
                param.navigate("/auth");
            }
            else {
                alert("Unexpected error has occured.")
            }
            param.globalData.clean();
        })();
    }

    return (
        <>
            <div>
                <b className="AddressCountry">
                    <p>
                        Your Shipping Addresses
                    </p>
                </b>
            </div>


            {
                param.CData === null || param.CData === undefined ? <Activity /> :

                    param.CData.shipping.length < 1 ?
                        <p style={{ fontSize: '1.5em', textAlign: 'center', fontWeight: '900' }}> You don't have a shipping address. Set one below. </p>
                        :
                        <div>
                            <form ref={param.checkout}>
                                {
                                    param.CData.shipping.map((item, index) =>
                                        <div key={index}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '85% 15%' }}>
                                                <div className="AddressCont">
                                                    <div>
                                                        <span className="AddressCountry">
                                                            {item['country']}
                                                        </span>
                                                        <hr />
                                                        <span className="AddressOther">
                                                            {item['street']}
                                                        </span>
                                                        <br />
                                                        <span className="AddressOther">
                                                            {item['street2']}
                                                        </span>
                                                        <br />
                                                        <span className="AddressOther">
                                                            {item['city']}
                                                        </span> <hr />
                                                        <span className="AddressOther">
                                                            {item['state']}
                                                        </span>
                                                        <br />
                                                        <br />
                                                        <span className="AddressOther">
                                                            {item['mobile']}
                                                        </span>
                                                    </div>

                                                    <div className="CenterVertically CenterHorizontally" onClick={() => {
                                                        param.globalData.start();
                                                        DeleteShippingAddress(item['id']);
                                                    }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                                                        </svg>
                                                    </div>

                                                </div>
                                                <div className="CenterHorizontally CenterVertically">
                                                    <input id={"input" + item['id']} type="radio" name="selectedShipping" value={item['id']} />
                                                </div>
                                            </div>
                                            <hr />
                                        </div>

                                    )}
                            </form>

                        </div>

            }
            <form ref={param.newShipment}>
                <hr />
                <div className="AddressCountry">
                    Create New Shipping Address
                </div>
                <hr />
                <div className="row g-3">

                    <div className="col-12">
                        <label htmlFor="address" className="form-label">Address</label>
                        <input type="text" className="form-control" id="address" placeholder="1234 Main St" required="" name="address1" />
                        <div className="invalid-feedback">
                            Please enter your shipping address.
                        </div>
                    </div>

                    <div className="col-12">
                        <label htmlFor="address2" className="form-label">Address cont. <span className="text-body-secondary">(Optional)</span></label>
                        <input type="text" className="form-control" id="address2" placeholder="Apartment or suite" name="address2" />
                    </div>

                    <div className="col-12">
                        <label htmlFor="mobile" className="form-label">Mobile Number <span className="text-body-secondary">(Optional)</span></label>
                        <input type="text" className="form-control" id="mobile" placeholder="Mobile number with country code." name="number" />
                    </div>


                    <div className="col-md-4">
                        <label htmlFor="city" className="form-label">City</label>
                        <input type="text" className="form-control" id="city" placeholder="" required="" name="city" />
                        <div className="invalid-feedback">
                            City is required to process shipping.
                        </div>
                    </div>

                    <div className="col-md-3">
                        <label htmlFor="state" className="form-label">State</label>
                        <input type="text" className="form-control" id="state" placeholder="" required="" name="state" />
                        <div className="invalid-feedback">
                            State is required to process shipping.
                        </div>
                    </div>

                    <div className="col-md-5">
                        <label htmlFor="country" className="form-label">Country</label>
                        <input type="text" className="form-control" id="country" placeholder="" required="" name="country" />
                        <div className="invalid-feedback">
                            Country is required to process order.
                        </div>
                    </div>
                </div>
                <br />
                <button type="submit" className="btn btn-info" onClick={(e) => {
                    param.globalData.start();
                    e.preventDefault();
                    SubmitShippingAddress();
                }}>
                    Add New Shipping Address
                </button>
            </form>
        </>
    )
}


const BodyBox = ({ param }) => {
    return (
        <>
            <div className="SideBySideResponsive">
                <div>
                    <Shipping param={{ 'CData': param.CData, 'newShipment': param.newShipment, 'SetCData': param.SetCData, 'checkout': param.checkout, 'globalData': param.globalData }} />
                </div>
                <div>
                    <Summary param={{ 'CData': param.CData, 'checkout': param.checkout, 'navigate': param.navigate, 'globalData': param.globalData }} />
                </div>
            </div>

        </>
    );
}

const Checkout = () => {
    const [CData, SetCData] = useState(null);
    const navigate = useNavigate();
    const newShipment = useRef(null);
    const checkout = useRef(null);
    const globalData = useContext(CompDataContext)

    useEffect(() => {
        globalData.start();
        (async function () {
            globalData.SetPercent(40);
            try {

                const resp = await fetch(env.REACT_APP_BH + '/checkout',
                    {
                        method: "GET",
                        headers: {
                            "Authorization": "Token " + document.cookie.split("=")[1]
                        }
                    }
                );
                const results = await resp.json();

                if (resp.status === 200) {
                    SetCData(results);
                }
                else if (resp.status === 301) {
                    navigate(results['path']);
                }
                else {
                    alert(results['err']);
                }
                globalData.clean();
            }
            catch (error) {
                console.log(error);
                alert("Unexpected error")
            }
        })();

    }, [])
    return (
        <>
            <div className="Subhead">
                <h1 className="centerText">
                    Complete Your Order
                </h1>
            </div>

            <hr />

            {
                CData === null ? <Activity /> :
                    <>
                        <BodyBox param={{ 'CData': CData, 'newShipment': newShipment, 'SetCData': SetCData, 'checkout': checkout, 'navigate': navigate, 'globalData': globalData }} />
                    </>
            }

        </>
    )
}

export default Checkout