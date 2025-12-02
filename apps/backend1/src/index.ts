import { WebSocketServer} from "ws";
import { GameManager } from "./GameManager";
import { connectToRedis } from "./redis/redisClient";
import { startWorker } from "./redis/worker";
async function main(){
    const wss=new WebSocketServer({port:5001});
    const redisClient = await connectToRedis();
    startWorker();
    const gamemanager = new GameManager(redisClient);
    wss.on('connection',(socket)=>{
        gamemanager.handleMessage(socket);
        socket.on('close',()=>gamemanager.removeUser(socket));
    })
}
main();