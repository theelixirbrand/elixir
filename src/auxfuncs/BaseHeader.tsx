import '../static/Base.css';
import { useContext, useState } from "react";
import { CompDataContext } from '../App.tsx';
import { Link } from 'react-router';
import Activity from './Activity.tsx';
import env from 'react-dotenv';
import Loading from './Loading.tsx';


const BaseHeader = () => {
    console.log("document cookie = " + document.cookie + " ends");
    const globalData = useContext(CompDataContext);
    const closeButtons = document.getElementsByClassName("addClose");
    const [isLoggingOut, SetIsLoggingOut] = useState(false);
    

    const offCanvasCloseButton = document.getElementsByClassName("btn-close")[0]
    Array.from(closeButtons).forEach((item) => { item.addEventListener("click", function () { offCanvasCloseButton.click() }) });
    const LogoutUser = () => {
        if (isLoggingOut) {
            return;
        }
        else {
            SetIsLoggingOut(true);
        }
        (async function () {

            const cookie = "Token " + document.cookie.split("=")[1];
            const response = await fetch(env.REACT_APP_BH + "/logout",
                {
                    method: "GET",
                    headers: {
                        "Authorization": cookie
                    }
                }
            );

            const results = await response.json();
            if (response.status === 200) {
                console.log(document.cookie)
                const SetUser = globalData['SetUser'];
                SetUser(undefined);
                document.cookie = "";
                console.log(document.cookie)
                window.location.reload();
            }
            else {
                alert(results['err']);
            }
            SetIsLoggingOut(false);
        })();
        return;
    }

    return (
        <div>
            <nav className="navbar bg-secondary bg-gradient fixed-top" >
                <div className="container-fluid">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div>
                            <Link className="navbar-brand Icon" style={{ color: 'white' }} to="/">{env.REACT_APP_CN}</Link>
                        </div>

                        {
                            globalData['user'] === undefined ?

                            <Link to="/auth" className="CatLinkBlack">
                            <div style={{ position: 'relative', cursor: 'pointer' }}>
                                <div style={{ position: 'absolute', top: '-1vh', right: '0' }}>
                                    <span style={{ fontSize: '0.5em', fontWeight: '900', backgroundColor: env.REACT_APP_CCB, padding: '0 0.5vh', borderRadius: '100%' }}>
                                        {globalData['cartCount']}
                                    </span>
                                </div>
                                <div>
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-cart4" viewBox="0 0 16 16">
                                            <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l.5 2H5V5zM6 5v2h2V5zm3 0v2h2V5zm3 0v2h1.36l.5-2zm1.11 3H12v2h.61zM11 8H9v2h2zM8 8H6v2h2zM5 8H3.89l.5 2H5zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </Link>

                        :

                        <Link to="/cart" className="CatLinkBlack">
                            <div style={{ position: 'relative', cursor: 'pointer' }}>
                                <div style={{ position: 'absolute', top: '-1vh', right: '0' }}>
                                    <span style={{ fontSize: '0.5em', fontWeight: '900', backgroundColor: '#0DCAF0', padding: '0 0.5vh', borderRadius: '100%' }}>
                                        {globalData['cartCount']}
                                    </span>
                                </div>
                                <div>
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-cart4" viewBox="0 0 16 16">
                                            <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l.5 2H5V5zM6 5v2h2V5zm3 0v2h2V5zm3 0v2h1.36l.5-2zm1.11 3H12v2h.61zM11 8H9v2h2zM8 8H6v2h2zM5 8H3.89l.5 2H5zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </Link>
                        }
                    </div>

                    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
                        <svg xmlns="http://www.w3.org/2000/svg" strokeWidth="1.5" stroke={env.REACT_APP_CCB} width="30" height="30" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                        </svg>
                    </button>
                    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">{globalData['compData'] !== null && globalData['compData']['name']}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                                <li className="nav-item">
                                    <Link className="nav-link active addClose" to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link addClose" to="/catalouge">Catalouge</Link>
                                </li>
                                <li className="nav-item dropdown">
                                    <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        More
                                    </span>
                                    <ul className="dropdown-menu">
                                        <li><Link className="dropdown-item addClose" to="/profile">Profile</Link></li>
                                        <li><Link className="dropdown-item addClose" to="/history">History</Link></li>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                        <li><Link className="dropdown-item addClose" to="/">Terms and conditions</Link></li>
                                    </ul>
                                </li>
                            </ul>
                            <form className="d-flex mt-3" role="search">
                                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                                <button className="btn btn-outline-success" type="submit">Search</button>
                            </form>
                            <br />
                            {globalData['loading'] ?

                                <Activity />
                                :
                                globalData['user'] ?
                                    <>
                                        <div className="SideBySide ">
                                            <Link to="/profile" className="CenterHorizontally btn btn-success" onClick={() => {
                                                document.getElementsByClassName('btn-close')[0].click();
                                            }}>
                                                <div className="CatLink" >
                                                    {globalData['user']['username']}
                                                </div>
                                            </Link>

                                            <div className="CenterHorizontally btn btn-danger" onClick={LogoutUser}>
                                                <div className="CatLink" >
                                                    {
                                                        isLoggingOut ?

                                                            <div className="spinner-border text-light CenterVerically" role="status" style={{ width: '1.5rem', height: '1.5rem' }}>
                                                                <span className="sr-only"></span>
                                                            </div>
                                                            : "Log out"
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="SideBySide ">
                                            <Link to="/auth" className="addClose CatLink" onClick={function () { offCanvasCloseButton.click() }}>
                                                <div className="CenterHorizontally btn btn-success">
                                                    Sign in
                                                </div>
                                            </Link>

                                            <Link to="/auth/sign-up" className="addClose CatLink" onClick={function () { offCanvasCloseButton.click() }}>
                                                <div className="CenterHorizontally btn btn-warning CatLink">
                                                    Sign up
                                                </div>
                                            </Link>
                                        </div>
                                    </>
                            }
                        </div>
                    </div>
                </div>
            </nav>
            <Loading />
        </div>
    )
}

export default BaseHeader