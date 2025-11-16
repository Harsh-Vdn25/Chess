import { WebSocketServer} from "ws";
import { GameManager } from "./GameManager";

const wss=new WebSocketServer({port:5001});
const gamemanager = new GameManager();

wss.on('connection',(socket)=>{
    gamemanager.addUser(socket);
    gamemanager.handleMessage(socket);
    socket.on('close',()=>gamemanager.removeUser(socket));
})