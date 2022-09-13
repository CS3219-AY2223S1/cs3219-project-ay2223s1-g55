import express from 'express';
import cors from 'cors';
// Used to create socket.io
import { createServer } from 'http';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import {
  createMatchRequest,
  findMatch,
  pendingMatchRequest,
  deleteMatchRequest,
} from './controller/matching-controller.js';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());

app.get('/', (req, res) => {
  res.send('Hello World from matching-service');
});

app.post('/match', createMatchRequest);
app.get('/match', findMatch);
app.get('/pending', pendingMatchRequest);
app.delete('/match', deleteMatchRequest);
const router = express.Router();

app.use('/api/match', router).all((_, res) => {
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
});

const PORT = process.env.PORT || 8001;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  // Need to explicitly enable CORS
  cors: {
    origin: ['http://localhost:3000', 'https://admin.socket.io'],
    credentials: true,
  },
});
// users in current server
let users = {};

// users in current Room
let roomUsers = {};

// dictionary of rooms in current server
let rooms = {};
// Run when clinet connects
// socket is the client
let messages = {
  general: [],
  random: [],
};

// middlewarre to check username and allow connection
io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error('invalid username'));
  }
  socket.username = username;
  next();
});

// Run when client connects
io.on('connection', (socket) => {
  // static id everytime we refresh page
  // const id = socket.handshake.query.id;
  // socket.join(id);
  console.log('New WS Connection...', socket.id);

  // annoucement when user connects
  socket.emit('message', 'Welcome to Server!');

  socket.on('send-message', (data) => {
    console.log('SEND MESSAGE EVENT', data.content);
    const { content, sender, roomId, chatName } = data;
    console.log(`payload is ${data.content}`);
    // Send to global room or server?
    if (roomId === '') {
      socket.broadcast.emit('send-message', data);
      // individual socket sned only to that room/socket in [to]
    } else {
      // socket.emit('sendMessage', data.payload);
      console.log('sending Message from index');
      // to same roomId does not seem to work
      console.log(`data is ${data.content}`);
      socket.to(roomId).emit('receive-message', data);
    }
  });
  // callback function from client side
  socket.on('join-room', ({ username, matchRoomID }, callback) => {
    console.log('server received join Room', matchRoomID + ' ' + username);
    socket.join(matchRoomID);
    console.log(socket.rooms);
    callback(`${username} joined room ${matchRoomID}`);

    const payload = {
      message: `${username} has joined the room ${matchRoomID}`,
      username: `${username}`,
    };
    const user = {
      username,
      id: socket.id,
    };
    // roomUsers.push(user);
    // io.to(roomId).emit('newUser', `${username} has joined the room ${roomId}`);
    socket.to(matchRoomID).emit('join-room', payload);
    // socket.emit('joinSuccess', `You have joined the room ${roomId}`);
  });

  socket.on('leave-room', ({ username, room }, callback) => {
    console.log('server received leave-room', room + ' ' + username);
    socket.leave(room);
    console.log(socket.rooms);
    callback(`${username} left the room ${room}`);

    const payload = {
      message: `${username} has left the room ${room}`,
      username: `${username}`,
    };
    const user = {
      username,
      id: socket.id,
    };
    socket.to(room).emit('leave-room', payload);
    // socket.emit('joinSuccess', `You have joined the room ${roomId}`);
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    io.emit('message', 'A user has left the chat');
  });
});

// TODO: Create a event listener 'match' that creates a new match in the database when provided with the
// TODO: Correct details (so dont use app, use socket instead?)
httpServer.listen(PORT, () => console.log(`matching-service listening on port ${PORT}`));

// Admin Dashboard for socket connections
instrument(io, { auth: false });
