import { SetStateAction } from "react";
import { refreshToken } from "../helper/api";
export function useSocket({socket,setSocket}:{
    socket:WebSocket|null|undefined,
    setSocket:React.Dispatch<SetStateAction<WebSocket|null>>
}){
    //@ts-ignore
    const token = window.__accessToken;
    if(!token){
        return;
    }
    const ws=new WebSocket(`ws://localhost:5001?token=${token}`);
    setSocket(ws);
    return socket;
}