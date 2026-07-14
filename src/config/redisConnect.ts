import Redis from "ioredis";
import { env } from "./env";

const redis = new Redis(env.REDIS_URL)

if(!redis) {
    throw new Error("there is erro with redis environment variable")
}
redis.on("connect" , ()=> {
    console.log("redis connected successfully")
})

redis.on("ready" , ()=> {
    console.log("redis is ready for usage")
})

redis.on("error" , (err)=> {
    console.error(err)
})