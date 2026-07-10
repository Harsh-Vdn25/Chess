import { clientType } from "./redisClient";
import { prisma } from "@repo/db/client";

let client:clientType;
export async function startWorker(client:clientType){
    console.log("Worker starting...");
    while (true) {
        const sleep = (ms:number) => new Promise(r=>setTimeout(r,ms));
        
        try{
            const gameMessages = await client.xRange("games",'-','+');
            if(gameMessages.length > 0){
                const moves = gameMessages.map(x=>{
                    //@ts-ignore
                    const parsed = JSON.parse(x.message.json);
                    console.log("parsed move part",parsed);
                    return {
                        gameId: parsed.gameId,
                        move:JSON.stringify(parsed.move)
                    }
                })
                await prisma.move.createMany({data:moves})
            }
            await client.del("games");
            const winMessages = await client.xRange("wins",'-','+');
            if(winMessages.length > 0){
                const wins :{
                    gameId: string,
                    winner: number,
                    loser: number
                }[] = winMessages.map(x=>{
                    //@ts-ignore
                    const parsed = JSON.parse(x.message.json);
                    return {
                        gameId: parsed.gameId,
                        winner: parsed.winnerId,
                        loser: parsed.loserId
                    }
                })
            for( const win of wins ){
                try{
                    await prisma.$transaction(async (tx)=>{
                        const winner = await tx.verdict.create({
                            data:{
                                winnerId: win.winner,
                                loserId: win.loser,
                                gameId: win.gameId
                            }
                        })
                        await tx.user.update({
                                where:{
                                    id:winner.winnerId
                                },
                                data:{
                                    points:{
                                        increment: 3
                                    },
                                    wins:{
                                        increment: 1
                                    }
                                }
                        })
                        await tx.user.update({
                            where:{
                                id:winner.loserId
                            },
                            data:{
                                points:{
                                    decrement: 3
                                },
                                losses:{
                                    increment: 1
                                }
                            }
                        })
                    })
                }catch(err){
                    console.log(err);
                }
            }
        }
        await client.del("wins");
        }catch(err){
            console.log("Worker error:",err);
        }
        await sleep(5000);
    }
}
