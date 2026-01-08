import WebSocket from "ws";
import { ERROR,GAME_OVER,INIT_GAME, REJOIN, TOKEN_ERROR } from "@repo/common/config";

type payloadType = typeof ERROR | typeof INIT_GAME | typeof GAME_OVER | typeof REJOIN | typeof TOKEN_ERROR;
export interface messageType{
    type: payloadType;
    gameId?:string;
    payload:{
        color?:"white" | "black",
        message?:string,
        winner?:string,
        FEN?:any
    } 
}

export function checkMove(a:string){
    const allowedRegex = /^[a-z][1-8]+$/;
    return allowedRegex.test(a);
}


export function sendMessage({type,payload}:messageType,socket:WebSocket){
    return socket.send(JSON.stringify({
        type:type,
        payload:payload
    }))
}