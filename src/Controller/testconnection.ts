import io from "socket.io-client"

const socket = io("http://localhost:5000" , {
    auth : {
        token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3b3JrZXJJZCI6IjZhNTYwODE4ZjM4ZmM0YjliYmNlNzM2OSIsImlhdCI6MTc4NDAyNTc1NywiZXhwIjoxNzg0MTEyMTU3fQ.LNyeTAb8e8PPsE8fEerZbSKCpT-ABMjo6NapD1vLIBg"
    }
})

socket.on("connect" , ()=> {
    console.log("i am worker connected my socket id " , socket.id)

  socket.emit("room:join" ,"6a527afdbbeee8ed5b294be6"  )

  socket.emit("message:send" , {
    roomId:"6a527afdbbeee8ed5b294be6",
    content:"i am the fullstack developer"
  })
})


socket.on("message:new" , (msg)=> {
   console.log("new message received succesfuly" , msg)
})


socket.on("connect_error" , (err)=> {
    console.log("error while connecting")
})