import z from "zod";

export function inputCheck(input:{username:string,password:string}){
    const  inputSchema = z.object({
        username: z.string().min(3).max(50),
        password: z.string().min(3).max(50)
    })
    const parsed = inputSchema.safeParse(input);
    if(!parsed.success){
        return {success: false,error: parsed.error.format()};
    }
    return {success: true,data:parsed.data}
}