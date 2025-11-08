import { WebSocketServer } from "ws"; 
import { GameManager } from "./GameManager";

const wss = new WebSocketServer({port:5001});

const gamemanager=new GameManager();
wss.on("connection",(ws)=>{
    gamemanager.addUser(ws);

    ws.on("close",()=>gamemanager.removeUser);
})