import { clientType, connectToRedis } from "./redisClient";
import { prisma } from "@repo/db/client";
interface movesType{
    gameId:string,
    move:string
}
let client:clientType;
export async function startWorker(){
    console.log("Worker starting...");
    client = await connectToRedis();
    await saveMessages();
}

async function saveMessages(){
    setTimeout(async()=>{
        const messages =  await client.xRange("games",'-','+');
        const moves :movesType[]= messages.map((x)=>{
            //@ts-ignore
            const parsed = JSON.parse(x.message.json);
            return {
                //@ts-ignore
                gameId:parsed.message.gameId,
                move:JSON.stringify(parsed.message.payload.move)
            }
        })
        try{
            console.log(moves);
            const response = await prisma.move.createMany({
            data:moves
        })
        console.log("saved:",response);
        await client.flushAll('ASYNC');
        }catch(err){
            console.log("failed",err);
            return;
        }
        saveMessages();
    },2500);    
}