import { SetStateAction } from "react";
export function useSocket({socket,setSocket}:{
    socket:WebSocket|null|undefined,
    setSocket:React.Dispatch<SetStateAction<WebSocket|null>>
}){
    //@ts-ignore
    const token = window.__accessToken;
    console.log(token);
    if(!token){
        return;
    }
    const ws=new WebSocket(`ws://localhost:5001?token=${token}`);
    setSocket(ws);
    return socket;
}