import jwt, { JwtPayload } from 'jsonwebtoken';

export const createToken=async(userId:number)=>{
    if(!userId)return;
    const token = jwt.sign({
        id:userId
    },"i like coding");
    return token;
}

export const decodeToken=async(token:string)=>{
    if(!token) return false;
    const decoded = jwt.decode(token);
    const userId = (decoded as JwtPayload).id;
    if(!userId) return ;
    return userId;
}