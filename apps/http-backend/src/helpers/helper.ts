import bcrypt from 'bcrypt';
require('dotenv').config()
export const hashPassword=async(password:string)=>{
    if(!password)return ;
    const hashedPassword = await bcrypt.hash(password,10);
    if(!hashedPassword){
        return ;
    }
    return hashedPassword;
}
 
export const getCred=(name:string)=>{
    if(!name) return "";
    const cred = process.env[name];
    if(!cred) return "";
    return cred;
}