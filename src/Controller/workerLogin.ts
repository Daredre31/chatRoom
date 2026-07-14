// controllers/worker.ts
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import WorkerModel from "../Model/worker";
import { loginWorkerSchema } from "../validation/zod";
import { sendRes } from "../Utils/response";
import redisClient from "../config/redisConnect";
import { env } from "../config/env";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

class WorkerController {
  loginWorker = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = loginWorkerSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendRes(res, 400, false, "invalid details", {
          details: parsed.error.flatten(),
        });
      }

      const { email, password } = parsed.data;

      const worker = await WorkerModel.findOne({ email }).select("+passwordHash");
      if (!worker) {
        return sendRes(res, 401, false, "invalid email or password", null);
      }

      const passwordMatches = await bcrypt.compare(password, worker.passwordHash);
      if (!passwordMatches) {
        return sendRes(res, 401, false, "invalid email or password", null);
      }

      const sessionId = uuid();
      const sessionData = {
        workerId: worker._id.toString(),
        ip: req.ip,
      };

      await redisClient.set(
        `session:${sessionId}`,
        JSON.stringify(sessionData),
        "EX",
        SESSION_TTL_SECONDS
      );

      const accessToken = jwt.sign(
        { workerId: worker._id.toString() }, // matches your socket middleware's expected shape
        env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      const refreshToken = jwt.sign(
        { sessionId },
        env.JWT_REFRESH,
        { expiresIn: "7d" }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: SESSION_TTL_SECONDS * 1000,
      });

      return sendRes(res, 200, true, "login successful", {
        token: accessToken,
        worker: {
          _id: worker._id,
          name: worker.name,
          email: worker.email,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return sendRes(res, 401, false, "no refresh token provided", null);
      }

      const verified = jwt.verify(refreshToken, env.JWT_REFRESH) as { sessionId: string };
      const redisKey = `session:${verified.sessionId}`;

      const rawSession = await redisClient.get(redisKey);
      if (!rawSession) {
        return sendRes(res, 401, false, "session expired", null);
      }

      const sessionData = JSON.parse(rawSession) as { workerId: string; ip: string };

      // rotate: delete the old session, issue a new one
      await redisClient.del(redisKey);

      const newSessionId = uuid();
      await redisClient.set(
        `session:${newSessionId}`,
        JSON.stringify(sessionData),
        "EX",
        SESSION_TTL_SECONDS
      );

      const newAccessToken = jwt.sign(
        { workerId: sessionData.workerId },
        env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      const newRefreshToken = jwt.sign(
        { sessionId: newSessionId },
        env.JWT_REFRESH,
        { expiresIn: "7d" }
      );

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: SESSION_TTL_SECONDS * 1000,
      });

      return sendRes(res, 200, true, "new access token generated", {
        token: newAccessToken,
      });
    } catch (err) {
      return sendRes(res, 401, false, "invalid or expired token", null);
    }
  };
}

export default new WorkerController();