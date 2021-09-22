const express = require('express');
const app = express();

// Why http? Here: https://stackoverflow.com/questions/17696801/express-js-app-listen-vs-server-listen

const http = require('http');
const server = http.createServer(app);

const {Server} = require('socket.io');
const io = new Server(server);



app.get('/', (req,res)=>{
  res.sendFile(__dirname + '/index.html');
})

//const listeners = io.sockets.listenersAny();
let count = io.engine.clientsCount;

let socketids = [];


io.on('connection', (socket)=>{
  socketids.push(socket.id);
  console.log(`A new user ${socketids.indexOf(socket.id)+1} connected!`);
  
  count = io.engine.clientsCount;
  console.log(`Total users: ${count}`);
  socket.on('disconnect', ()=>{
    console.log(`User ${socketids.indexOf(socket.id)+1} disconnected :(`);
  });
  socket.on('chat message', (msg, id)=>{
    io.emit('chat message', `User ${socketids.indexOf(id)+1}: ${msg}`); // This will emit the event to all connected sockets

  });
  
});


let port = 8080;


server.listen(port, ()=>{
  console.log(`Listening on ${port}!`);
})