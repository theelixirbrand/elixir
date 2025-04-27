import { Link, useParams, useNavigate } from "react-router";
import { useState, useEffect, useContext } from "react";
import env from "react-dotenv";
import { ProductList } from "./Index.tsx";

import {CompDataContext} from "../App.tsx";
import {AddToCart} from "../auxfuncs/AddToCart.tsx";
import {AddCommaToNum} from "../auxfuncs/Misc.tsx";
import Activity from '../auxfuncs/Activity.tsx';

export const ProdImages = ({ param }) => {
    const image1 = param["picture1"];
    const image2 = param["picture2"];

    return (
        <>
            <div style={{marginTop : '10vh'}}>
                <div className="SideBySide">
                    <div>
                        <img src={env.REACT_APP_BH + image1} className="ProdImage" alt={image1} loading="lazy"/>
                    </div>

                    <div>
                        <img src={env.REACT_APP_BH + image2} className="ProdImage" alt={image2} loading="lazy"/>
                    </div>
                </div>
            </div>
        </>
    )
}

const Details = ({ param }) => {
    const product = param['prod'];
    const SetCartCount = param['SetCartCount'];
    const navigate =  param['navigate'];
    const user = useContext(CompDataContext)['user'];

    return (
        <>
            <hr />
            <div className="btn btn-outline-info CenterHorizontally" onClick={()=>{ 
                param.start();
                AddToCart(product['id'], SetCartCount, navigate, -99, param["SetPercent"], param["clean"], user);
                }}>
                <div>
                    ADD TO CART
                </div>
            </div>
            <hr />

            <p className="BigText">
                {product['name']}
            </p>

            <Link to="/">
                More like {product['name']}
            </Link>

            <div>
                <p className="Price">
                    $ {AddCommaToNum(product['price'])}
                </p>

                <p>
                    {product['in_stock'] ? "IN STOCK" : "OUT OF STOCK"}
                </p>
            </div>

            <div>
                <p style={{ fontSize: '2em' }}>
                    PRODUCT DETAILS
                </p>
            </div>

            <div style={{ padding: "2vw" }}>
                <div className="GrayBack">
                    <p>
                        <b>
                            Description
                        </b>
                    </p>
                    <hr />
                    <span>
                        {product['details']}
                    </span>
                </div>
            </div>
        </>
    )
}

const More = ({ param }) => {

    const more = param['item']
    return (
        <>
            <div>
                <div>
                    <p style={{ fontSize: "2em" }}>
                        You may also like
                    </p>
                </div>

                <div>
                    <ProductList param={{ 'item': more, 'render': "CAT" }} />
                </div>
            </div>
        </>
    )
}

const SingleProd = () => {
    const params = useParams();
    const [prodData, SetPD] = useState(null);
    const [isLoading, SetIsLoading] = useState(true);
    const [extraData, SetED] = useState(null);
    const [loadingED, SetLED] = useState(true);

    const SetCartCount = useContext(CompDataContext)['SetCartCount'];
    const navigate = useNavigate();

    const globalData = useContext(CompDataContext);



    useEffect(() => {
        globalData.SetPercent(60);
        (async () => {
            
            const response = await fetch(env.REACT_APP_BH + "/product/" + params['prodSlug']);
            if (response.status === 200) {
                const results = await response.json();
                SetPD(results);
                console.log(results)
                SetIsLoading(false);
                
            }
            globalData.SetPercent(100);
            globalData.clean();
        })();

        (async () => {
            const response = await fetch(env.REACT_APP_BH + "/more/" + params['prodSlug']);
            if (response.status === 200) {
                const results = await response.json();
                SetED(results);
                SetLED(false);
            }

        })();


    }, [params.prodSlug])
    return (
        <>
            {isLoading ?
                <>
                    <br /><br /><br /><br /><br /><br /><br />
                    <Activity/>
                </>
                :
                <>
                    <ProdImages param={{ 'picture1': prodData['product']['picture1'], 'picture2': prodData['product']['picture2'] }} />
                    <Details param={{ 'prod': prodData['product'], 'SetCartCount' : SetCartCount, 'navigate' : navigate, 'SetPercent' : globalData.SetPercent, 'clean': globalData.clean, 'start':globalData.start }} />
                    {!loadingED && <More param={{ 'item': extraData['more'] }} />}
                    

                </>
            }
        </>
    )
}

export default SingleProd