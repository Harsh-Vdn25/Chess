import WebSocket from "ws";
import { ERROR,GAME_OVER,INIT_GAME } from "@repo/common/config";
export interface messageType{
    type: typeof ERROR | typeof INIT_GAME | typeof GAME_OVER;
    gameId?:string;
    payload:{
        color?:"white" | "black",
        message?:string,
        winner?:string
    } 
}

export function checkMove(a:string){
    const allowedRegex = /^[a-z0-9]+$/;
    return allowedRegex.test(a);
}


export function sendMessage({type,payload}:messageType,socket:WebSocket){
    return socket.send(JSON.stringify({
        type:type,
        payload:payload
    }))
}