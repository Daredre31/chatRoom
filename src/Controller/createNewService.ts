
import { Request, Response, NextFunction } from "express";
import service from "../Model/service";
import { createServiceSchema } from "../validation/zod";
import { sendRes } from "../Utils/response";

class ServiceController {
  createService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = createServiceSchema.safeParse(req.body);

      if (!parsed.success) {
        return sendRes(res, 400, false, "invalid details", {
          details: parsed.error.flatten(),
        });
      }

      const { serviceName, slug } = parsed.data;

      const existing = await service.findOne({ slug });
      if (existing) {
        return sendRes(res, 409, false, "a service with this slug already exists", null);
      }

      const servicecreate = await service.create({ serviceName, slug});

      return sendRes(res, 201, true, "service created", { servicecreate });
    } catch (err) {
      next(err);
    }
  };

  getservice = async(req:Request , res:Response , next:NextFunction) => {
     try {
       const allservice = await service.find()
       if(allservice.length === 0) {
        return sendRes(res , 400 , false , "could not fetch service")
       }
       sendRes(res , 200 , true , "all service" , allservice)
     } catch (error) {
      next(error)
     }
  }
}

export default new ServiceController();