// controllers/room.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import ServiceModel from "../Model/service";
import RoomModel from "../Model/Room"
import { joinRoomSchema } from "../validation/zod";
import { sendRes } from "../Utils/response";
import { env } from "../config/env";
import { AuthRequest } from "../middleware/auth";

interface RoomTokenPayload {
  roomId: string;
  clientSessionId: string;
}

class RoomController {
  joinRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = joinRoomSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendRes(res, 400, false, "invalid details", {
          details: parsed.error.flatten(),
        });
      }

      const { serviceSlug, existingToken } = parsed.data;

      // this check first if conversation is going already 
      if (existingToken) {
        try {
          const decoded = jwt.verify(existingToken, env.JWT_SECRET) as RoomTokenPayload;
          const room = await RoomModel.findOne({
            _id: decoded.roomId,
            clientSessionId: decoded.clientSessionId,
          });

          if (room && room.status === "open") {
            return sendRes(res, 200, true, "reconnected to existing room", {
              roomId: room._id,
              token: existingToken,
            });
          }
        } catch {
          // invalid/expired token — fall through to create a new room
        }
      }

      // new joining path using service slug
      const service = await ServiceModel.findOne({ slug: serviceSlug });
      if (!service) {
        return sendRes(res, 404, false, "service not found", null);
      }

      if (!service.workerId) {
        return sendRes(res, 503, false, "no worker currently assigned to this service", null);
      }

      const clientSessionId = uuid();

      const room = await RoomModel.create({
        serviceId: service._id,
        workerId: service.workerId,
        clientSessionId,
        status: "open",
        lastMessageAt: new Date(),
      });

      const token = jwt.sign(
        { roomId: room._id.toString(), clientSessionId } as RoomTokenPayload,
        env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      return sendRes(res, 201, true, "room created", {
        roomId: room._id,
        token,
      });
    } catch (err) {
      next(err);
    }
  }

  getworkerRoom = async (req:AuthRequest , res:Response , next:NextFunction) => {
    try {
      const workerId = req.user?.workerId

      if(!workerId) {
        return sendRes(res , 401 , false , "invalid user/authorised")
      }

      const rooms = await RoomModel.find({
        workerId , status:"open"
      }).sort({
        lastMessageAt: -1
      })

      return sendRes(res, 200, true, "rooms fetched", { rooms })
    } catch (error) {
      next(error)
    }
  }
}

export default new RoomController();