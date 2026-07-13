import io from "socket.io-client"

const socket = io("http://localhost:5000" , {
    auth : {
        token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3b3JrZXJJZCI6IjZhNTIyODZiMDc4MmRmZjRhYTE5ZDIyNyIsImlhdCI6MTc4Mzc5MjA1MSwiZXhwIjoxNzg0Mzk2ODUxfQ.-5x51qVJL7gXOnp5Kg5rXSRj_tCXpmGEA1XwxlrOq-s"
    }
})

socket.on("connect" , ()=> {
    console.log("i am worker connected my socket id " , socket.id)

  socket.emit("room:join" ,"6a527afdbbeee8ed5b294be6"  )

  socket.emit("message:send" , {
    roomId:"6a527afdbbeee8ed5b294be6",
    content:"i am boy greetings yall"
  })
})



socket.on("connect_error" , (err)=> {
    console.log("error while connecting")
})