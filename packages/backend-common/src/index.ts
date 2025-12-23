import jwt, { JwtPayload } from 'jsonwebtoken';

export const createToken = (userId: number, isAccess:boolean,secret:string): string | undefined => {
    if (!userId || !secret) return;

    const token = jwt.sign(
        {id : userId},
        secret,
        isAccess?{ expiresIn:"15m" }:{expiresIn:"30d"}
    );
    return token;
};
export const decodeToken=async(token:string)=>{
    if(!token) return false;
    const decoded = jwt.decode(token);
    const userId = (decoded as JwtPayload).id;
    if(!userId) return ;
    return userId;
}