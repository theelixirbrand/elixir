import env from 'react-dotenv';

export const GetCSRF = async () =>{
    const resp = await fetch(env.REACT_APP_BH + '/retrieve');
    if(resp.status===200){
        const results = await resp.json()
        console.log(results);
        return results['csrfToken'];
    }
    else{
        return false;
    }
    
};

export const AddCommaToNum = (_number)=>{
    const number = _number.toString();
    const length = number.length;
    if(length < 4){
        return number;
    }
    let final = "";
    let counter = 0;
    while(counter < length)
    {
        final = number[length - counter -1] + final;
        counter ++;
        if(counter %3 === 0 && length - counter > 0){
            final = "," + final
        }
    }
    return final;
}
