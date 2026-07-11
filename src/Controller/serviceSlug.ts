// import service from "../Model/service";
// import {Request , Response , NextFunction} from 'express'
// import { toserviceRoom } from "../validation/zod";
// import { sendRes } from "../Utils/response";

// class serviceSlug {
//    serviceSlug = async (req:Request , res:Response , next:NextFunction) => {
//       const serviceRequest = toserviceRoom.safeParse(req.body)

//      if(!serviceRequest.success) {
//         return sendRes(res , 400 ,false, "invalid details", {details:serviceRequest.error.flatten()})
//      }
//      try {
//         const { serviceSlug } = serviceRequest.data

//         const findService = await service.findOne({slug:serviceSlug})

//         if(!findService) {
//             return sendRes(res , 404 , false , 'no service found')
//         }

//         sendRes(res , 200 , true , 'service found' , findService)
//      } catch (error) {
//         next(error)
//      }
//    }
// }
// export default new serviceSlug()