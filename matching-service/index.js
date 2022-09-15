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

const router = express.Router();
router.get('/', (_, res) => {
  res.send('Hello World from matching-service');
});

router.get('/match', findMatch);
router.post('/match', createMatchRequest);
router.get('/pending', pendingMatchRequest);
router.delete('/match', deleteMatchRequest);

app.use('/api/match', router).all((_, res) => {
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
});

const PORT = process.env.PORT || 8001;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  // Edit here to include new URL to access socket
  cors: {
    origin: ['http://localhost:3000', 'https://admin.socket.io'],
    credentials: true,
  },
});

// TODO: Room/Namespace and Message management
// Run when clinet connects
// socket is the client
let messages = {
  general: [],
  random: [],
};

// disabled middleware to check username and allow connection
// io.use((socket, next) => {
//   const username = socket.handshake.auth.username;
//   if (!username) {
//     return next(new Error('invalid username'));
//   }
//   socket.username = username;
//   next();
// });

// Run when client connects
io.on('connection', (socket) => {
  // static id everytime we refresh page
  // const id = socket.handshake.query.id;
  // socket.join(id);
  console.log('New WS Connection...', socket.id);

  // announcement when user connects
  socket.emit('message', 'Welcome to Server!');

  socket.on('send-message', (data) => {
    const { content, sender, roomId, chatName } = data;
    console.log(`send-message event'payload content is ${data.content}`);
    if (roomId === '') {
      // Send globally to all listeners in socket
      socket.broadcast.emit('send-message', data);
    } else {
      // Send to specific room
      socket.to(roomId).emit('receive-message', data);
    }
  });

  // callback function from client side
  socket.on('join-room', ({ username, matchRoomID }, callback) => {
    console.log('server received join Room', matchRoomID + ' ' + username);
    socket.join(matchRoomID);
    // Set of rooms in socket
    console.log(socket.rooms);
    callback(`${username} joined room ${matchRoomID}`);

    const payload = {
      message: `${username} has joined the room ${matchRoomID}`,
      username: `${username}`,
    };
    const user = {
      username,
      id: socket.id,
      matchRoomID: matchRoomID,
    };
    socket.emit('join-room-success', user);
    socket.to(matchRoomID).emit('join-room', payload);
  });

  // TODO: Add leave-room-success event, and clear it on the frontend
  socket.on('leave-room', ({ username, room }, callback) => {
    console.log('server received leave-room ' + room + ' ' + username);
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
    // server emit the annoucement to the room instead bc socket no longer in room
    io.to(room).emit('leave-room', payload);
  });

  socket.on('match-found', ({ username, difficulty, mongodbID, roomSocketID }) => {
    console.log('server received match-found');
    const payload = {
      message: `${username} has found a match`,
      username,
      difficulty,
      mongodbID,
      roomSocketID,
    };
    // either use socket or io, using socket need to join first
    io.to(roomSocketID).emit('match-found', payload);
    socket.join(mongodbID);
    // socket.broadcast.emit('match-found', payload);
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    io.emit('message', 'A user has left the chat');
  });
});

// TODO: Create a event listener 'match' that creates a new match in the database when provided with the
// TODO: Correct details (so dont use app, use socket instead?)
httpServer.listen(PORT, () => console.log(`matching-service listening on port ${PORT}`));
// app.listen(8001, () => console.log('user-service listening on port 8001'));
// Admin Dashboard for socket connections, use https://admin.socket.io to access
instrument(io, { auth: false });
