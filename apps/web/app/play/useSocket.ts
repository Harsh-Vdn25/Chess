import { SetStateAction } from "react";

export function useSocket({socket,setSocket}:{
    socket:WebSocket|null|undefined,
    setSocket:React.Dispatch<SetStateAction<WebSocket|null>>
}){
    const ws=new WebSocket("ws://localhost:5001");
    setSocket(ws);
    return socket;
}