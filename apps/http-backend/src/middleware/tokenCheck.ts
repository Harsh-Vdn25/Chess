import {NextFunction, Request,Response} from 'express';
import { verifyToken } from '@repo/backend-common/index';
export async function checkToken(req:Request,res:Response,next:NextFunction){
    const token = req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(400).json({message:"Invalid token"})
    };
    const userId = await verifyToken(token,process.env.AUTH_SECRET !);
    
    if(!userId){
        return res.status(401).json({message:"Unauthorized"});
    }
    (req as any).userId = userId;
    next();
}