import { Response } from "express"

interface ApiResponse<D> {
    success:boolean,
    message:string,
    data? :D

}

export function sendRes<D>(res:Response , statusCode:number, success:boolean , message:string , data?:D):Response {
   const responseData :ApiResponse<D> = {
    success , message
   }

   if(data !== undefined ) {
      responseData.data = data
   }

   return res.status(statusCode).json(responseData)
}

