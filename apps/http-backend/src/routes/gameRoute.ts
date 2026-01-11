import express, { Router } from 'express';
import { gameVerdict, getMoves } from '../controllers/gameController';
import { checkToken } from '../middleware/tokenCheck';
export const gameRouter:Router = express.Router();

gameRouter.get('/verdict',checkToken,gameVerdict);
gameRouter.get('/moves',checkToken,getMoves);