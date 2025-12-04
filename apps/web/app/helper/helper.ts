"use client"
export async function login(username:string,password:string){
    try{
        const res = await fetch(`http://localhost:5000/api/user/signin`,{
            method:"POST",
            credentials:"include",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({username,password})
        });
        const data = await res.json();
        //@ts-ignore
        window.__accessToken = data.token;
        localStorage.setItem("Token",data.token);
        return data.message;
    }catch(err){
        console.log(err);
    }
}