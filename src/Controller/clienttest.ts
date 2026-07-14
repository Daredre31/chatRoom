import io from "socket.io-client"

const socket = io("http://localhost:5000" , {
    auth : {
        token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb29tSWQiOiI2YTUyN2FmZGJiZWVlOGVkNWIyOTRiZTYiLCJjbGllbnRTZXNzaW9uSWQiOiI4MDAzZTQyZC1kMTJmLTQ1ZDEtOTkyNS1mMGZhNjg1Y2VjYmEiLCJpYXQiOjE3ODM3OTAzMzQsImV4cCI6MTc4NjM4MjMzNH0.FlGiQSRGNx2O-K1RkoEh1YLyO79mCPONNOSRK-a-4B4"
    }
})

socket.on("connect" , ()=> {
    console.log("i am client connected my socket id " , socket.id)

    socket.emit("message:send" , {
        roomId:"6a527afdbbeee8ed5b294be6",
        content:"i wants a fullstack developer"
    })
})

socket.on("message:new" , (msg) => {
    console.log("new message received" , msg)
})

socket.on("connect_error" , (err)=> {
    console.log("error while connecting")
})