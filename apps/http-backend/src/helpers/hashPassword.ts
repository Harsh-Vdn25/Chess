import bcrypt from 'bcrypt';

export async function hashPassword(password:string){
    if(!password)return ;
    const hashedPassword = await bcrypt.hash(password,10);
    if(!hashedPassword){
        return ;
    }
    return hashedPassword;
}