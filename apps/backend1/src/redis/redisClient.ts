import { createClient } from "redis";
require("dotenv").config()

export type clientType = ReturnType<typeof createClient>;

export async function connectToRedis():Promise<clientType>{
    const client = createClient({
        url: process.env.REDIS_URL,
        socket: {
        reconnectStrategy: retries => Math.min(retries * 100, 3000),
      },
    })
    client.on('error',err=>{
        console.error("Redis Client Error:",err);
    })
    await client.connect();
    console.log("Connected to the redis Client");
    return client;
}