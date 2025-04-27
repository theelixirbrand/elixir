import { Route, Routes } from "react-router";
import SignIn from "./SignIn.tsx";
import SignUp from "./SignUp.tsx"

export const validator=(_string)=>{
    if (_string.trim() === "")
    {
        return false;
    }
    const acceptables = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890-_@.+";
    return Array.from(_string).every(item=> acceptables.includes(item));
}

const Auth = ()=>{
    return (
        <>
        <div className=" BackWrapper CenterVertically">
            <h1 className="BigText centerText">
            The international markets are waiting
            </h1>
        </div>
        <hr />
            <Routes>
                <Route path="/" element = {<SignIn />} />
                <Route path="/sign-up" element = {<SignUp/>}/>
            </Routes>
        <hr />

        </>
    )
}

export default Auth