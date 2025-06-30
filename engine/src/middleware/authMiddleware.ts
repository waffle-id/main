import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import CONFIG from "@/config";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = Error("Invalid token");
    (error as any).statusCode = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, CONFIG.JWT_SECRET);
    (req as any).user = decoded; // Attach user data to request
    next();
  } catch (err) {
    next(err);
  }
}
