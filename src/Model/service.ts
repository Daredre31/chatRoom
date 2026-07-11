import { Schema , model , Types , Document } from "mongoose";

export interface typedService extends Document {
    serviceName:string,
    workerId:Types.ObjectId,
    slug:string

}

const serviceSChema = new Schema<typedService>({
    serviceName:{type:String},
    workerId:{type:Schema.Types.ObjectId , ref:'worker' , default:null},
    slug:{type:String , unique:true , lowercase:true }
})
 
const service = model<typedService>('service' , serviceSChema)
export default service 

