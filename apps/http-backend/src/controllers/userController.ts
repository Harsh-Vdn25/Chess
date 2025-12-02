import type{ Request,Response } from "express";
import {prisma} from '@repo/db/client';
import { hashPassword } from "../helpers/hashPassword";
import bcrypt from 'bcrypt';
import { createToken } from "@repo/backend-common/index";
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
        const token = await createToken(response.id);
        return res.status(200).json({
            message:"successfully signed up",
            token:token
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
        const token = await createToken(response.id);
        return res.status(200).json({
            message:"successfully signed up",
            token:token
        });
    }catch(err){
        res.status(500).json({message:err});
    }
}