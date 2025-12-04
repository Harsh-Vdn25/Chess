import WebSocket from "ws";
export interface usersGame{
    player1:number;
    player2:number;
    gameId:string;
}
export interface usersType{
    socket:WebSocket;
    userId:String;
}
export const users : usersType[] = [];
export const userGame : usersGame[] = [];
