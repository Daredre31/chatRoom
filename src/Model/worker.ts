import { Schema , model ,Types , Document,  }  from "mongoose";

export interface typedWorker extends Document {
    name:string,
    email:string,
    passwordHash:string,
    serviceId:Types.ObjectId,
    isOnline:boolean,
    createdAt:Date
}

const worker = new Schema<typedWorker>({
   name:{type:String , minlength:5 , required:true ,trim:true},
   email:{type:String , unique:true , required:true},
   passwordHash:{type:String , minlength:6 , select:false , required:true},
   serviceId:{type:Schema.Types.ObjectId , ref:"service"},
   isOnline:{type:Boolean , default:false}
}, {timestamps:true})


const workerModel = model<typedWorker>('worker' , worker)

export default workerModel 