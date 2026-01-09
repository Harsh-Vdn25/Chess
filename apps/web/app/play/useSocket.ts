import {  useEffect, useState } from "react";
import { URLS } from "../config/URLConfig";
import { refreshToken } from "../helper/api";
export function useSocket(){
   const [socket,setSocket] = useState<WebSocket|null>(null);
   useEffect(()=>{
    async function Connect(){
        let token = localStorage.getItem('Token');
        const ws_url=URLS.WS_URL;
        if(!ws_url){
            throw new Error("No URL present");
        }
        if(!token){
            token = await refreshToken();
            if(!token) return ;
            localStorage.getItem("Token");
        }
        const ws=new WebSocket(`${ws_url}?token=${token}`);
        setSocket(ws);
    }
    Connect();
   },[]);
    return socket;
}