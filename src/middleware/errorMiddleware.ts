import { Request , Response , NextFunction } from "express";
import { env } from "../config/env";



export class ApiError extends Error {
    public statusCode :number
    constructor(message:string , statusCode:number){
      super(message),
      this.statusCode = statusCode,
      this.name="ApiError"
    }
}

export const errorFunction = (err:Error , req:Request , res:Response , next:NextFunction) => {
   let statusCode= 500 
   let message = "something went wrong try again"

   if(err instanceof ApiError) {
    statusCode = err.statusCode,
    message= err.message
   }  else if((err as NodeJS.ErrnoException & {code?:number}).code === 1100){
     statusCode = 400 , 
     message = "this value already exist as a record "
   } else if(err.name == "validationError") {
    statusCode = 400 ,
    message = err.message
   } else if (err.name == "CastError") {
    statusCode = 400 ,
    message = "invalid id provoded "
   }

if(env.isDev) console.error("error:" , err) 

    res.status(statusCode).json({
        success:false , message
    })
}