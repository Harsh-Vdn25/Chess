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
    while (true) {
        const sleep = (ms:number) => new Promise(r=>setTimeout(r,ms));
        
        try{
            const gameMessages = await client.xRange("games",'-','+');
        if(gameMessages.length > 0){
            const moves = gameMessages.map(x=>{
                //@ts-ignore
                const parsed = JSON.parse(x.message.json);
                return {
                    gameId: parsed.message.gameId,
                    move:JSON.stringify(parsed.message.payload.move)
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
                    gameId: parsed.message.gameId,
                    winner: parsed.message.payload.winnerId,
                    loser: parsed.message.payload.loserId
                }
            })
            for( const win of wins ){
                try{
                    const winner = await prisma.verdict.create({
                        data:{
                            WinnerId: win.winner,
                            gameId: win.gameId
                        }
                    })
                    await prisma.user.update({
                            where:{
                                id:winner.WinnerId
                            },
                            data:{
                                points:{
                                    increment: 3
                                }
                            }
                    })
                    await prisma.user.update({
                        where:{
                            id:win.loser
                        },
                        data:{
                            points:{
                                decrement: 3
                            }
                        }
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
