import { Request,Response,NextFunction } from 'express';
import {z} from 'zod';

export function inputCheck(req:Request,res:Response,next:NextFunction){
    const inputSchema = z.object({
        username: z.string().min(3).max(50),
        password: z.string().min(3).max(50)
    })
    const parsed = inputSchema.safeParse(req.body);
    if(!parsed.success){
        return res.status(400).json({message:"invalid input"});
    }
    (req as any).parsed = parsed.data;
    next();
}