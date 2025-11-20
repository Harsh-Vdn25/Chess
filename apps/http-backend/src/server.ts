import express from 'express';
const app=express();
app.use(express.json());

app.use('/api/user',);
app.use('/api/room',);

app.listen("5001",()=>{
    console.log("Hello");
})