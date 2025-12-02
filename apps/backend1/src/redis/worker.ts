import { connectToRedis } from "./redisClient";
import { prisma } from "@repo/db/client";

export async function startWorker(){
    const client = await connectToRedis();
    const moves=[];
    // setTimeout(()=>{
        
    // },[2500])
}

startWorker();