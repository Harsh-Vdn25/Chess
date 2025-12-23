import { URLS } from "../config/URLConfig";
export async function login(username:string,password:string,type:string){
    try{
        const res = await fetch(`${URLS.HTTP_URL}/api/user/${type}`,{
            method:"POST",
            credentials:"include",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({username,password})
        });
        const data = await res.json();
        if(!data.token){
            return null;
        }
        //@ts-ignore
        window.__accessToken = data.token;
        localStorage.setItem("Token",data.token);
        return data.message;
    }catch(err){
        console.log(err);
    }
}