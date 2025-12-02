import express from 'express';
import { userRouter } from './routes/userRoute';
const app=express();
app.use(express.json());

app.use('/api/user',userRouter);

app.listen("5000",()=>{
    console.log("Hello");
})