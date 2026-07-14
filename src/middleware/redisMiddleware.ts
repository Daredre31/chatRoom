import { NextFunction, Request  , Response} from "express";
import redis from "../config/redisConnect";

const cachesware = (ttl:number) => {
    return async(req:Request, res:Response , next:NextFunction) => {
      const key = req.originalUrl;

      try {
        const getKey = await redis.get(key);
        if(getKey) {
            return res.json(JSON.parse(getKey))
        }

        // now it is time to intercept the response provided i do not have it in my redis cache lets get it started

        const originExpreessRes = res.json.bind(res);

        res.json = (body) => {
           redis.set(key , JSON.stringify(body) , "EX" , ttl) .catch(() => {})
           return originExpreessRes(body)
        }

     

      } catch {
        // dont run i dont need you rn
      }

      next()
    }

       
}