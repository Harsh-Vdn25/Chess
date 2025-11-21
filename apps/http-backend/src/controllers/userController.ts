import type{ Request,Response } from "express";
import {client} from '@repo/db/client';
import { hashPassword } from "../helpers/hashPassword";
import bcrypt from 'bcrypt';

export async function Signup(req:Request,res:Response){
    const {username,password,firstName}=req.body;
    try{
        const hashedPassword = await hashPassword(password);
        if(!hashPassword) return;
        const response = await client.user.create({
            data:{
                username:username,
                password:hashedPassword,
                firstName:firstName
            }
        })
        return res.status(200).json({message:"successfully signed up"});
    }catch(err){
        res.status(500).json({message:""});
    }
}

export async function Signin(req:Request,res:Response){
    const {username,password}=req.body;
    try{
        const response = await client.user.findUnique(username);
        if(!response){
            return res.status(404).json({message:"User doesnot exist"});
        }
        const isAuthorized = await bcrypt.compare(password,response?.password);
        if(!isAuthorized){
            return res.status(401).json({message:"Wrong password"});
        }
        return res.status(200).json({message:"successfully signed up"});
    }catch(err){
        res.status(500).json({message:""});
    }
}