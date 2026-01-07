import type{ Request,Response } from "express";
import {prisma} from '@repo/db/client';
import { hashPassword,getCred } from "../helpers/helper";
import bcrypt from 'bcrypt';
import { createToken, decodeToken } from "@repo/backend-common/index";
export async function Signup(req:Request,res:Response){
    const {username,password,firstName}=req.body;
    try{
        const hashedPassword = await hashPassword(password);
        if(!hashedPassword) return;
        const response = await prisma.user.create({
            data:{
                username:username,
                password:hashedPassword
            }
        })
        const accessToken = createToken(response.id,true,getCred("ACCESS_SECRET"));
        return res.status(200).json({
            message:"successfully signed up",
            token:accessToken
        });
    }catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }
}

export async function Signin(req:Request,res:Response){
    const {username,password}=req.body;
    try{
        const response = await prisma.user.findUnique({
            where:{username}
        });
        if(!response){
            return res.status(404).json({message:"User doesnot exist"});
        }
        const isAuthorized = await bcrypt.compare(password,response?.password);
        if(!isAuthorized){
            return res.status(401).json({message:"Wrong password"});
        }
        const accessToken = await createToken(response.id,true,getCred("ACCESS_SECRET"));
        const refreshToken = await createToken(response.id,false,getCred("REFRESH_SECRET"));
        
        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"lax",
            path:"/api/auth/refresh"
        });

        return res.status(200).json({
            message:"successfully signed in",
            token:accessToken
        });
    }catch(err){
        res.status(500).json({message:err});
    }
}

export async function refresh(req:Request,res:Response){
    const token = req.cookies.refreshToken;
    if(!token) return res.status(401).json({error:"No refresh token"});

    try{
        const userId =await decodeToken(token);
        if(!userId){
            return res.status(401).json({error:"Invalid token"});
        }
        const newAccessToken = createToken(userId,true,getCred("ACCESS_SECRET"));
        return res.json({newAccessToken:newAccessToken});
    }catch(err){
        return res.status(403).json({ error: "Invalid refresh token" });
    }
}