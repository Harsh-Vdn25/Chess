import WebSocket from "ws";
import { ERROR,GAME_OVER,INIT_GAME,MOVE, REJOIN, TOKEN_ERROR } from "@repo/common/config";

type payloadType = typeof ERROR | typeof INIT_GAME | typeof MOVE | typeof GAME_OVER | typeof REJOIN | typeof TOKEN_ERROR;
export interface messageType{
    type: payloadType;
    userId?: number;
    gameId?:string;
    payload:{
        color?:"white" | "black",
        message?:string,
        FEN?:any
    } 
}

export function checkMove(a:string){
    const allowedRegex = /^[a-z][1-8]+$/;
    return allowedRegex.test(a);
}


export function sendMessage({type,gameId,userId,payload}:messageType,socket:WebSocket){
    return socket.send(JSON.stringify({
        type:type,
        userId:userId,
        gameId:gameId,
        payload:payload
    }))
}