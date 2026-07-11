import mongoose from "mongoose";
import { env } from "./env";

mongoose.connection.on('connected' , () => { console.log("database connected successfully") })
mongoose.connection.on('error' , () => { console.log("an error occured") })
mongoose.connection.on('disconnected' , () => {console.log('db disconnected')})


export const connectDB = async () => {
   await mongoose.connect(env.MONGO_URL , {
     maxPoolSize:15 ,
     socketTimeoutMS:45000,
     serverSelectionTimeoutMS:10000,
     family:4
   })
}

export const disconnected = () => {
    mongoose.disconnect()
}