import WebSocket from "ws";
export interface usersType{
    socket:WebSocket;
    userId:number;
}
export const users : usersType[] = [];
