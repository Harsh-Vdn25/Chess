import { createClient } from "redis";

export type clientType = ReturnType<typeof createClient>;

export async function connectToRedis():Promise<clientType>{
    const client = createClient({
        url:"redis://localhost:6379"
    })
    client.on('error',err=>{
        console.error("Redis Client Error:",err);
    })
    await client.connect();
    console.log("Connected to the redis Client");
    return client;
}