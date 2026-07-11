import { Schema , model , Types , Document } from "mongoose";
import { typedService } from "./service";

export interface typedRoom extends Document {
    serviceId:Types.ObjectId,
    workerId:Types.ObjectId,
    clientSessionId:string,
    status:'open' | 'close',
    lastMessageAt:Date
}

const roomSchema = new Schema<typedRoom>({
    serviceId:{type:Schema.Types.ObjectId , required:true , ref:"service"},
    workerId:{type:Schema.Types.ObjectId , required:true , ref:"worker"},
    clientSessionId:{type:String , unique:true},
    status:{type:String , enum:['open' ,'close'] , default:'open'},
    lastMessageAt:{type:Date , default:Date.now()}
},{timestamps:true})

roomSchema.index({workerId:1 , serviceId:1 } )

const room = model<typedRoom>('room' , roomSchema)

export default room