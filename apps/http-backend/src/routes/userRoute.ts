import express, { Router } from 'express';
export const userRouter:Router = express.Router();
import { Signin,Signup } from '../controllers/userController';
userRouter.post('/signin',Signin);
userRouter.post('/signup',Signup);