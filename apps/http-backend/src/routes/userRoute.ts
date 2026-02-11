import express, { Router } from 'express';
export const userRouter:Router = express.Router();
import { getProfile, logout, refresh, Signin,Signup } from '../controllers/userController';
import { inputCheck } from '../middleware/inputCheck';
import { checkToken } from '../middleware/tokenCheck';

userRouter.post('/signin',inputCheck,Signin);
userRouter.post('/signup',inputCheck,Signup);
userRouter.post('/refresh',refresh);//for sending the accessToken
userRouter.get('/profile',checkToken,getProfile);
userRouter.post('/logout',logout);