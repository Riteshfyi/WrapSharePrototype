const express = require("express");
const {Server} = require("socket.io");
const {createServer} = require("http");
const cors = require("cors");

const PORT = 5000;

const app = express();

const server = createServer(app);

const io = new Server(server,{
    cors: {
      origin: "https://wrapshareproto.vercel.app",
      credentials: true,
    },
  });

app.use(cors({
    cors: {
      origin: "https://wrapshareproto.vercel.app",
      credentials: true,
    },
  }))

io.on("connection",(socket)=>{
  console.log(`User Connect : ${socket.id}`);

  socket.on("send",({target,chunk})=>{
    console.log(`sending chunks from ${socket.id} to ${target}`);
   
    socket.to(target).emit("receive",chunk);
  })

  socket.on("exit",(target)=>{
    socket.to(target).emit("exit");
  }
  )

   socket.on("disconnect",()=>{
    console.log(`User : ${socket.id} disconnected.`)
   })
})

server.listen(PORT,()=>{console.log(`Server is running on port : ${PORT}`)})

