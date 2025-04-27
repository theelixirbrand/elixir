import { GetCSRF } from "../auxfuncs/Misc.tsx";
import env from "react-dotenv";


export const AddToCart = (itemID, SetCartCount, navigate, update, SetPercent, clean, user) => {
    SetPercent(40);
    (async function () {
        if(user === undefined){
            navigate("/auth");
        }
        const csrf = await GetCSRF();
        if (csrf) {
            SetPercent(70);
            const resp = await fetch(env.REACT_APP_BH + '/add-to-cart/',
                {
                    method: 'POST',
                    headers: {
                        "Authorization": "Token " + document.cookie.split("=")[1],
                        "X-CSRFToken": csrf,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ 'itemID': itemID, 'update': update })
                }
            );
            
            const results = await resp.json();
            if (resp.status === 200) {
                alert(results['msg'])
                SetCartCount(results['cartCount']);
                clean();
            }
            else if (resp.status === 301) {
                navigate(results['path']);
                clean();
            }
            else {
                alert(results['err']);
                clean();
            }
            return true;
        }
    })()
}
