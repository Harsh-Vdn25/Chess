import express, { Router } from 'express';
import { gameVerdict, getMoves } from '../controllers/gameController';
import { checkToken } from '../middleware/tokenCheck';
import { rateLimiter } from '../middleware/rateLimiter';
export const gameRouter:Router = express.Router();

gameRouter.get('/verdict',rateLimiter,checkToken,gameVerdict);
gameRouter.get('/moves',rateLimiter,checkToken,getMoves);