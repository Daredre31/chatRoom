
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendRes } from "../Utils/response";
import { env } from "../config/env";

interface WorkerTokenPayload {
  workerId: string;
}

export interface AuthRequest extends Request {
  user?: WorkerTokenPayload;
}

const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const bearerToken = req.headers.authorization;

    if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
      return sendRes(res, 401, false, "no token provided", null);
    }

    const token = bearerToken.split(" ")[1];

    if (!token) {
      return sendRes(res, 401, false, "invalid token format", null);
    }

    const verified = jwt.verify(token, env.JWT_SECRET) as WorkerTokenPayload;

    req.user = verified;

    next();
  } catch (error: any) {
    return sendRes(res, 401, false, "invalid or expired token", null);
  }
};

export default protect;