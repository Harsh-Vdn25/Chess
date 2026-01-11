import { prisma } from "@repo/db/client";
import { Request,Response } from "express";

export async function gameVerdict(req:Request,res:Response){
    const gameId = req.query.gameId;
    if(!gameId || typeof gameId !== 'string') return res.status(400).json({message:"Invalid gameId"})

    try{
        const gameVerdict = await prisma.verdict.findUnique({
            where:{gameId:gameId}
        })
        if(!gameVerdict) return res.status(404).json({messsage:"No game with this gameId exists"})
        res.status(200).json({
            winner:gameVerdict.WinnerId
        });
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getMoves(req:Request,res:Response){
    const gameId = req.query.gameId;
    if(!gameId || typeof gameId !== 'string') return res.status(400).json({message:"Invalid gameId"})
    
    try{
        const moves = await prisma.move.findMany({
            where:{gameId:gameId},
            orderBy:{createdAt:'asc'}
        })
        if(moves.length === 0)return res.status(404).json({message:"Invalid gameId! No moves exist"});
        res.status(200).json(moves);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
}