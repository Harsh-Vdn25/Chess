import Redis from "ioredis";

const redis = new Redis();//connects to locally running redis instance

const WINDOW = 60 * 1000;
const LIMIT = 30;

export async function isAllowed(ip:number){
    const key = `rate:${ip}`;
    const now = Date.now();

    //Remove requests older than 60seconds
    await redis.zremrangebyscore(key,0,now - WINDOW);

    //count requests in the current window
    const count = await redis.zcard(key);

    if(count>=LIMIT){
        return false;
    }

    //store current timestamp
    await redis.zadd(key,now,`${now}`);

    //Delete the key after the window
    await redis.expire(key,60);

    return true;
}