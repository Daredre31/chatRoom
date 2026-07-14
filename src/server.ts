import express from 'express'
import { env } from './config/env'
import { connectDB } from './config/db'
import route from './Route/allRoute'
import http from 'http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import { MessageModel } from './Model/message'


interface ClientTokenPayload {
  roomId: string;
  clientSessionId: string;
}

interface WorkerTokenPayload {
  workerId: string;
}

type SocketTokenPayload = ClientTokenPayload | WorkerTokenPayload;

const app = express()

app.use(express.json())
app.use('/api', route)

const server = http.createServer(app)

const io = new Server(server , {
  cors: {origin:"*"}
})


io.use((socket , next )=> {

  const verifyToken = socket.handshake.auth?.token

  if(!verifyToken) {
    return next(new Error("no valid token provided"))
  }

  try {
    const decoded = jwt.verify(verifyToken, env.JWT_SECRET) as SocketTokenPayload
    socket.data.payload= decoded

  next()
  } catch (error) {
    next(new Error("invalid token"))
  }
})


io.on('connection' , (socket) => {
  console.log("someoone connected" , socket.id)
  console.log('socket data payload' , socket.data.payload)

  const payload = socket.data.payload

  if("roomId" in payload) {
    socket.join(payload.roomId)

    console.log(`socket ${socket.id} joined room ${payload.roomId}`)

     const room = io.sockets.adapter.rooms.get(payload.roomId)
  console.log("sockets currently in this room:", room)
  }

  socket.on("room:join", (roomId) => {
  socket.join(roomId)
  console.log(`worker socket ${socket.id} joined room ${roomId}`)

  const room = io.sockets.adapter.rooms.get(roomId)
  console.log("everyone currently in this room:", room)
})

socket.on("message:send" , async(data) => {

  const payload = socket.data.payload
  const isWorker = "workerId" in payload

  const message = await MessageModel.create({
    roomId: data.roomId,
    senderType: isWorker ? "worker" : "client",
    senderId: isWorker ? payload.workerId : undefined,
    content: data.content,
    readByWorker: isWorker
  })

  io.to(data.roomId).emit("message:new", {
    _id: message._id,
    roomId: data.roomId,
    senderType: message.senderType,
    content: message.content,
    createdAt: message.createdAt,
  })
  console.log("message content" , message._id)
})
})
const port = env.PORT


const serverStart = async() => {
     try {

      await connectDB()

      server.listen(port , ()=> {
        console.log(`server is running on port ${port}`)
      })
     } catch (error) {
      console.log(error),
      process.exit(1)
     }
}

serverStart()
  