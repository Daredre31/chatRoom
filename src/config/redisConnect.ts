import Redis from "ioredis";
import { env } from "./env";

if(!env.REDIS_URL) {
    throw new Error("there is erro with redisClient environment variable")
}
const redisClient = new Redis(env.REDIS_URL)


redisClient.on("connect" , ()=> {
    console.log("redisClient connected successfully")
})

redisClient.on("ready" , ()=> {
    console.log("redisClient is ready for usage")
})

redisClient.on("error" , (err)=> {
    console.error(err)
})

export default redisClient