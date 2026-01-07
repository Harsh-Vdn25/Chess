import {  useEffect, useState } from "react";
import { URLS } from "../config/URLConfig";
export function useSocket(){
   const [socket,setSocket] = useState<WebSocket|null>(null);
   useEffect(()=>{
    //@ts-ignore
    const token = localStorage.getItem('Token');
    const ws_url=URLS.WS_URL;
    if(!ws_url){
        throw new Error("No URL present");
    }
    if(!token){
        return;
    }
    const ws=new WebSocket(`${ws_url}?token=${token}`);
    setSocket(ws);
   },[]);
    return socket;
}