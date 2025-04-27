import { useParams} from "react-router";
import { useState, useEffect, useContext } from "react";
import env from "react-dotenv";
import { SingleProduct } from "./Index.tsx";
import {CompDataContext} from '../App.tsx';

const SingleCat = () => {
    const { catSlug } = useParams();
    const [catData, SetCatData] = useState(null);
    const [loading, SetLoading] = useState(true);
    
    const globalData = useContext(CompDataContext);

    const data = globalData;
    const catS = catSlug; 
    const clean = globalData['clean'];
    useEffect(() => {
        const fetchCatData = async () => {
            const response = await fetch(env.REACT_APP_BH + "/categories/" + catS);
            if (response.status === 200) {
                const results = await response.json();
                SetCatData(results);
                SetLoading(false);
            }
            if(data){
            data.clean()
        };

            return;
        }
        data.start();
        data.SetPercent(40);
        
        
        fetchCatData();
    }, [catS]);
    return (
        <>
            { !loading &&
            <div className="HideX">
                <div style={{backgroundImage:`url(${env.REACT_APP_BH+catData['cat']['background']})`}} className="CatSlugWrapper CenterVertically" >
                    <h1 style={{ textTransform: "capitalize" }}>
                        {catSlug}
                    </h1>
                </div>
                <div className="BodyGridCont">
                    {catData &&
                    catData['products'].map((item, index)=>
                        <div key = {index}>
                            <SingleProduct param={{ 'item': item, 'index': index, 'render': 'CAT' }} />   
                        </div>
                    )
                    }
                </div>
            </div>
            }
        </>
    )
}

export default SingleCat