import { WebSocketServer} from "ws";
import { GameManager } from "./GameManager";
import { connectToRedis } from "./redis/redisClient";
import { startWorker } from "./redis/worker";
async function main(){
    const wss=new WebSocketServer({port:5001});
    const redisClient = await connectToRedis();
    startWorker();
    const gamemanager = new GameManager(redisClient);
    wss.on('connection',(socket,request)=>{
        const url = request.url;
        const queryParams = new URLSearchParams(url?.split("?")[1]);
        const token = queryParams.get("token");
        if(!token){
            return ;
        }
        gamemanager.handleMessage(socket,token);
    })
}
main();