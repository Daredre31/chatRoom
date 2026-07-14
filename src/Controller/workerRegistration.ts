// controllers/worker.ts
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import WorkerModel from "../Model/worker";
import ServiceModel from "../Model/service";
import {  registerWorkerSchema } from "../validation/zod";
import { sendRes } from "../Utils/response";
import { env } from "../config/env";
import { v4 as uuid} from "uuid";
import redis from "../config/redisConnect";
import { Jwt } from "jsonwebtoken";

class WorkerController {
  registerWorker = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = registerWorkerSchema.safeParse(req.body);

      if (!parsed.success) {
        return sendRes(res, 400, false, "invalid details", {
          details: parsed.error.flatten(),
        });
      }

      const { name, email, password, serviceId } = parsed.data;

      // does this service actually exist?
      const service = await ServiceModel.findById(serviceId);
      if (!service) {
        return sendRes(res, 404, false, "service not found", null);
      }

      // is this service already taken by another worker?
      if (service.workerId) {
        return sendRes(res, 409, false, "this service already has a worker assigned", null);
      }

      // is this email already registered?
      const existingWorker = await WorkerModel.findOne({ email });
      if (existingWorker) {
        return sendRes(res, 409, false, "a worker with this email already exists", null);
      }

      const passwordHash = await bcrypt.hash(password, env.SALT_ROUND);

      const worker = await WorkerModel.create({
        name,
        email,
        passwordHash,
        serviceId,
        isOnline: false,
      });

      // link the service back to this worker
      service.workerId = worker._id;
      await service.save();

      return sendRes(res, 201, true, "worker registered", {
        worker: {
          _id: worker._id,
          name: worker.name,
          email: worker.email,
          serviceId: worker.serviceId,
        },
      });
    } catch (err) {
      next(err);
    }
  }

}

export default new WorkerController();