import { Request, Response, NextFunction } from "express";
import { isAllowed } from "./redis";

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ip = Number(req.ip);
  const allowed = await isAllowed(ip);

  if (!allowed) {
    return res.status(429).json({
      message: "Too many requests",
    });
  }
  next();
};
