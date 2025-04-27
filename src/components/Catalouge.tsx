import {Link} from "react-router";
import { useState, useEffect, useContext } from "react";
import env from "react-dotenv";
import{CompDataContext} from '../App.tsx';


const CatHeader = () => {
    return (
        <div className="BackWrapper CenterVertically CenterHorizontally">
            <p className="BigText">
                Explore Our Categories
            </p>
        </div>
    )
}

const BodyGrid = ({ param }) => {
    const catArray = param['catArray'];


    return (
        <div className="BodyGridCont">
            {catArray &&
                catArray.map((item, index) =>
                    <div key={index} className="CenterHorizontally">

                        <div className="card" style={{width: "18rem"}}>
                            <img className="card-img-top" src={env.REACT_APP_BH+item['background']} alt={item['background']} style={{width: "100%"}}/>
                                <div className="card-body">
                                    <h5 className="card-title">{item['name1']} {item['name2']}</h5>
                                    <p className="card-text">{item['slug']}.</p>
                                    <Link to={"/explore-cat/" + item['slug']} className="btn btn-primary">View products</Link>
                                </div>
                        </div>
                    </div>

                )
            }
        </div>
    )
}

const Catalouge = () => {
    const [loading, SetLoading] = useState(true);
    const [catData, SetCatData] = useState(null);
    const globalData = useContext(CompDataContext);
    

    const BodyData = async () => {
        const response = await fetch(env.REACT_APP_BH + "/categories");
        if (response.status === 200) {
            const results = await response.json();
            SetCatData(results);
            SetLoading(false);
            globalData.clean();
        }
    }

    useEffect(() => {
        globalData.start();
        globalData.SetPercent(50);
        BodyData();
    }, []);

    return (
            <div className="HideX">
                <CatHeader />
                {!loading && <BodyGrid param={{ 'catArray': catData['categories'] }} />}
                
            </div>

    );
}

export default Catalouge