import { connectToRedis } from "./redisClient";

export async function startWorker(){
    const client = await connectToRedis();
    const moves=[];
    const messages = await client.xRead(
        {
            key:"games",
            id:"$"
        }
    );

    setTimeout(()=>{

    },2500); 
}

startWorker();