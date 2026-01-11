import toast from "react-hot-toast";
import { URLS } from "../config/URLConfig";
import { inputCheck } from "./inputCheck";
export async function login(username:string,password:string,type:string){
    const check = inputCheck({username,password});
    if(!check.success){
        if(check.error?.username?._errors){
            toast.error(`username ${check.error?.username?._errors}`)
        }
        if(check.error?.password?._errors){
            toast.error(`password ${check.error?.password?._errors}`);
        }
        return;
    }
    try{
        const res = await fetch(`${URLS.HTTP_URL}/api/user/${type}`,{
            method:"POST",
            credentials:"include",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                username: check.data?.username,
                password: check.data?.password
            })
        });
        const data = await res.json();
        if(!data.token){
            return null;
        }
        return data.message;
    }catch(err){
        console.log(err);
    }
}