import express, { Router } from 'express';
export const userRouter:Router = express.Router();
import { getProfile, logout, refresh, Signin,Signup } from '../controllers/userController';
import { inputCheck } from '../middleware/inputCheck';
import { checkToken } from '../middleware/tokenCheck';
import { rateLimiter } from '../middleware/rateLimiter';

userRouter.post('/signin',rateLimiter,inputCheck,Signin);
userRouter.post('/signup',rateLimiter,inputCheck,Signup);
userRouter.post('/refresh',rateLimiter,refresh);//for sending the accessToken
userRouter.get('/profile',rateLimiter,checkToken,getProfile);
userRouter.post('/logout',rateLimiter,logout);