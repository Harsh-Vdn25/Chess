import { SetStateAction } from "react";
import { URLS } from "../config/URLConfig";
export function useSocket({socket,setSocket}:{
    socket:WebSocket|null|undefined,
    setSocket:React.Dispatch<SetStateAction<WebSocket|null>>
}){
    //@ts-ignore
    const token = window.__accessToken;
    const ws_url=URLS.WS_URL;
    if(!ws_url){
        throw new Error("No URL present");
    }
    if(!token){
        return;
    }
    const ws=new WebSocket(`${ws_url}?token=${token}`);
    setSocket(ws);
    return socket;
}