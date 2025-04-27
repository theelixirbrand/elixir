import { Link, useNavigate } from 'react-router';
import { useState, useEffect, useContext } from "react";
import env from 'react-dotenv';
import { CompDataContext } from '../App.tsx';

import Activity from '../auxfuncs/Activity.tsx';
import { AddToCart } from "../auxfuncs/AddToCart.tsx";
import { AddCommaToNum } from "../auxfuncs/Misc.tsx";

const TurnOffLoadScreen = (slug, render, _index) => {
  const elems = document.getElementsByClassName(slug+render+_index);
  Array.from(elems).forEach((item)=>{
    item.style.opacity = '0';
  });
  return;
};


function ViewCatalouge() {
  return (
    <div className="BackWrapper CenterVertically CenterHorizontally">
      <div className="CatWrapper">
        <h1 className="CatLink">
          <Link to="/catalouge" className="CatLink">
            {env.REACT_APP_HSH}
          </Link>

        </h1>
      </div>
    </div>
  )
}

export const SingleProduct = ({ param }) => {
  const item = param['item'];
  const index = param['index'];
  const render = param['render'];
  const clean = useContext(CompDataContext)['clean'];
  const user = useContext(CompDataContext)['user'];
  const SetCartCount = useContext(CompDataContext)['SetCartCount'];
  const SetPercent = useContext(CompDataContext)['SetPercent'];
  const start = useContext(CompDataContext)['start'];
  const navigate = useNavigate();

  return (
    <>
      <div key={index} className={render === 'CAT' ? "ProductCard CenterHorizontally" : "CenterHorizontally"}>
        <div className="CatLinkBlack" onClick={() => {
          start();
          navigate("/product/" + item['slug'])
        }} style={{ position: 'relative' }}>
          <div className={"CenterVertically CenterHorizontally LoadingImageA" + " " + item['slug'] +render  + index}>
            <div class="text-light">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
          <img src={env.REACT_APP_BH + item['picture1']} alt={item['name']} className={"SingleIndexProd" + render} loading="lazy" onLoad={()=>{
            TurnOffLoadScreen(item['slug'], render, index);
          }}/>
        </div>
        <hr />
        {
          render === 'CAT' &&
          <>
            <div className="PriceAndCartCont">
              <div className="CenterVertically NoTextOverflow">
                <p className="centerText Price" >$&nbsp;{AddCommaToNum(item['price'])}</p>
              </div>

              <div style={{backgroundColor : env.REACT_APP_ATCB}} className="AddToCartWrapper CenterVertically CenterHorizontally" onClick={
                () => {
                  start();
                  AddToCart(item['id'], SetCartCount, navigate, -99, SetPercent, clean, user);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-cart-plus-fill" viewBox="0 0 16 16">
                  <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0" />
                </svg>
              </div>

            </div>
          </>
        }
      </div>

    </>
  )
}

export const ProductList = ({ param }) => {
  const productData = param['item'];
  const render = param['render']
  return (
    <div className="IndexProdList">
      {productData && productData.map((item, index) =>
        <div key={index}>
          <SingleProduct param={{ 'item': item, 'index': index, 'render': render }} />
        </div>
      )}
    </div>
  )
}

const Categories = ({ param }) => {
  const cats = param;
  return (

    cats.map((item, index) =>
      <div key={index}>
        <p className="IndexCatName">
          {item['name1']} {item['name2']}
        </p>
        <ProductList param={{ item: item['products'], render: 'CAT' }} />
      </div>
    )
  )
}

const LoadedData = () => {
  const [indexData, SetIndexData] = useState(null);
  const [isLoading, SetIsLoading] = useState(true);
  const clean = useContext(CompDataContext)['clean'];
  const SetPercent = useContext(CompDataContext)['SetPercent'];
  const start = useContext(CompDataContext)['start'];

  const fetchData = async () => {
    start();
    SetPercent(60);
    const cookie = "Token " + document.cookie.split("=")[1];
    const response = await fetch(env.REACT_APP_BH,
      {
        method: 'GET',
        headers: {
          'Authorization': cookie
        }
      }
    );

    if (response.status === 200) {
      const result = await response.json();
      SetIndexData(result);
      SetIsLoading(false);
    }
    else {
      alert("An Unexpected error has occured.");
    }
    clean();
  }

  useEffect(() => {
    SetPercent(60);
    fetchData();
  }, []);


  return (
    <>
      {
        isLoading ? <Activity /> :
          <>
            <ProductList param={{ item: indexData['products'], render: 'MAIN' }} />
            <Categories param={indexData['cats']} />
            <ShopAbout />
          </>
      }

    </>
  )
}

const ShopAbout = () => {
  const company = useContext(CompDataContext)['compData'];
  return (
    <>
      {company ? <div>
        <p>
          <b>
            <span style={{ fontSize: '5vmin' }}>
              {company['name']} - WORLD'S NO. 1 MISC AND ACCESSORIES STORE.
            </span>
            <br />
            <span style={{ fontSize: '4vmin' }}>
              GET ALL THE CLOTHING APPARRELS YOU WOULD EVER NEED AT {company['name']}.
            </span>
          </b>
        </p>
        <p>
          Address: {company['address']} <br />
          {company['about']}
        </p>

        <b style={{ fontSize: '3.5vmin' }}>
          {company["subhead"]}
        </b>
        <hr />
        <p>
          {company['about2']}
        </p>

      </div> : <Activity />}
    </>
  )
}

function App() {


  return (

    <div className="mainWrapper">
      <ViewCatalouge />
      <hr />
      <LoadedData />
      <hr />

    </div>
  );
}

export default App;
