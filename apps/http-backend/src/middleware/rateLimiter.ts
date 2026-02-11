import { Request, Response, NextFunction } from "express";
import { SlidingWindow } from "../utils/slidingWindow";

const rates = new Map();
export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = (req as any).userId;
  if(!rates.has(userId)){
    const limiter = new SlidingWindow(5,3);
    if(!limiter.allowRequest()){
        return res.status(429).send("Too many requests.");
    }
  }else{
    const userLimiter = rates.get(userId);
    if(!userLimiter.allowRequest()){
        return res.status(429).send("Too many requests.");
    }
  }
  next();
};
