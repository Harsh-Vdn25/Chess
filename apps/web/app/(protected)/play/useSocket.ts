import {  useEffect, useState } from "react";
import { URLS } from "../../config/URLConfig";
import { useAuth } from "../../context/AuthContext";
export function useSocket(){
   const [socket,setSocket] = useState<WebSocket|null>(null);
   const {token} = useAuth();
   useEffect(()=>{
    const ws_url=URLS.WS_URL;
        if(!ws_url){
            throw new Error("No URL present");
        }
        const ws=new WebSocket(`${ws_url}?token=${token}`);
        setSocket(ws);
        return ()=>{
            ws.close();
            setSocket(null)
        }
   },[]);
    return socket;
}