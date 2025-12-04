import express from 'express';
import { userRouter } from './routes/userRoute';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app=express();

const corsOptions={
    origin:"http://localhost:3000",
    methods:["GET","PUT","POST","DELETE"],
    credentials:true
};
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions))
app.use('/api/user',userRouter);

app.listen("5000",()=>{
    console.log("Hello");
})