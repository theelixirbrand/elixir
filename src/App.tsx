import { HashRouter, Routes, Route } from "react-router";
import Index from './components/Index.tsx';
import env from "react-dotenv";
import { createContext, useState, useEffect, useRef } from "react";
import Catalouge from "./components/Catalouge.tsx";
import BaseHeader from "./auxfuncs/BaseHeader.tsx";
import SingleCat from "./components/SingleCat.tsx";
import Cart from "./components/Cart.tsx";
import Footer from "./auxfuncs/Footer.tsx";
import Checkout from "./components/Checkout.tsx";
import Payment from "./components/Payment.tsx";

import "./static/Base.css";
import SingleProd from "./components/SingleProd.tsx";
import Auth from "./components/Auth.tsx";
import Profile from "./components/Profile.tsx";
import History from "./components/History.tsx";
import Summary from "./components/Summary.tsx";


export const CompDataContext = createContext(null);

const App = () => {
  const [compData, SetCompData] = useState(null);
  const [cartCount, SetCartCount] = useState(0);
  const [user, SetUser] = useState(undefined);
  const [loading, SetLoading] = useState(true);
  const backref = useRef(null);
  const [percent, SetPercent] = useState(10);

  const fetchCompData = async () => {
    const cookie = "Token " + document.cookie.split("=")[1];
    const result = await fetch(env.REACT_APP_BH + "/get-global-context",
      {
        method: "GET",
        headers: {
          "Authorization": cookie
        }
      }
    );
    if (result.status === 200) {
      const response = await result.json()
      SetUser(response['user']);
      SetCompData(response['company']);
      SetCartCount(response['cartCount']);
    }
    else {
      return null;
    }
    SetLoading(false);
  }
  const clean = () => {
    SetPercent(100);
    backref.current.style.zIndex = '-1';
    backref.current.style.opacity = '0';
    setTimeout(()=>{
      SetPercent(100);
    }, 1000);
  };
  const start = () =>{
    backref.current.style.zIndex='10';
    backref.current.style.opacity='1';
  }
  useEffect(() => {
    fetchCompData();
  }, []);


  return (
    <div className="HideX">
      <CompDataContext.Provider value={{ 'compData': compData, 'cartCount': cartCount, 'SetCartCount': SetCartCount, 'user': user, 'SetUser': SetUser, 'loading': loading, 'percent': percent, 'SetPercent': SetPercent, 'backref': backref, 'clean' : clean, 'start' : start }}>
        <HashRouter>
          <BaseHeader />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalouge" element={<Catalouge />} />
            <Route path="/explore-cat/:catSlug" element={<SingleCat />} />
            <Route path="/product/:prodSlug" element={<SingleProd />} />
            <Route path="/auth/*" element={<Auth />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/check-out" element={<Checkout />} />
            <Route path="/payment/:transID" element={<Payment />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/history" element={<History />} />
            <Route path="/summary/:orderID" element={<Summary />} />
          </Routes>
          <Footer />
        </HashRouter>
      </CompDataContext.Provider>
    </div>
  )
}

export default App