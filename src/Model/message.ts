// models/Message.ts
import { Schema, model, Document, Types } from "mongoose";

export interface IMessage extends Document {
  roomId: Types.ObjectId;
  senderType: "client" | "worker";
  senderId?: Types.ObjectId;
  content?: string;
  fileUrl?: string;
  fileName?: string;
  readByWorker: boolean;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  roomId: { type: Schema.Types.ObjectId, ref: "room", required: true },
  senderType: { type: String, enum: ["client", "worker"], required: true },
  senderId: { type: Schema.Types.ObjectId, ref: "worker" },
  content: { type: String },
  fileUrl: { type: String },
  fileName: { type: String },
  readByWorker: { type: Boolean, default: false },
}, { timestamps: { createdAt: true, updatedAt: false } });

messageSchema.index({ roomId: 1, createdAt: 1 });

export const MessageModel = model<IMessage>("Message", messageSchema);