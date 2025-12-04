import express, { Router } from 'express';
export const userRouter:Router = express.Router();
import { refresh, Signin,Signup } from '../controllers/userController';
userRouter.post('/signin',Signin);
userRouter.post('/signup',Signup);
userRouter.post('/refresh',refresh);//for sending the accessToken