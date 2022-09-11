import express from 'express';
import cors from 'cors';
// Used to create socket.io
import { createServer } from 'http';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import { createMatchRequest, findMatch } from './controller/matching-controller.js';

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
let users = [];

// users in current Room
let roomUsers = [];
// Run when clinet connects
// socket is the client
let messages = {
  general: [],
  random: [],
};

// middlewarre to check username and allow connection
// io.use((socket, next) => {
//   const username = socket.handshake.auth.username;
//   if (!username) {
//     return next(new Error('invalid username'));
//   }
//   socket.username = username;
//   next();
// });

io.on('connection', (socket) => {
  const users = [];
  console.log('New WS Connection...', socket.id);

  socket.on('connect', () => {
    socket.emit('message', 'connected to server');
    // io.emit('message', 'A user has joined the chat');
  });
  socket.emit('message', 'Welcome to Server!');
  // for (let [id, socket] of io.of('/').sockets) {
  //   users.push({
  //     userID: id,
  //     username: socket.username,
  //   });
  // }
  // socket.emit('users', users);

  // socket.broadcast.emit('user connected', {
  //   userID: socket.id,
  //   username: socket.username,
  // });

  // socket.on('private message', ({ content, to }) => {
  //   socket.to(to).emit('private message', {
  //     content,
  //     from: socket.id,
  //   });
  // });
  // [to] is either the roomId/chatname/socketID
  // socket.on('receiveMessage', (payload) => {
  //   console.log('payload', payload);
  //   const { roomId, content } = payload;
  //   socket.to(roomId).emit('receiveMessage', {
  //     content,
  //     from: roomId,
  //   });
  // });
  //  socket.broadcast.to('rlch2E1W3Mm2QYVYAAAb').emit('receiveMessage', 'HEllo world');

  socket.on('sendMessage', (data) => {
    console.log('SEND MESSAGE EVENT', data.content);
    const { content, sender, roomId, chatName } = data;
    console.log('payload roomID', roomId);
    console.log('payload content', content);
    console.log('send message event payload:', data);
    if (roomId === '') {
      socket.broadcast.emit('sendMessage', data);
      // individual socket sned only to that room/socket in [to]
    } else {
      // socket.emit('sendMessage', data.payload);
      console.log('sending Message from index');
      // to same roomId does not seem to work
      socket.to(roomId).emit('sendMessage', data);
      console.log('payload is: ', data);
    }
  });
  // callback function from client side
  socket.on('joinRoom', ({ username, matchRoomID }, callback) => {
    console.log('server recevied joinRoom', matchRoomID + ' ' + username);
    socket.join(matchRoomID);
    callback(`Joined ${matchRoomID}`);

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
    socket.to(matchRoomID).emit('joinRoom', payload);
    // socket.emit('joinSuccess', `You have joined the room ${roomId}`);
  });
  // Runs when client disconnects
  socket.on('disconnect', () => {
    io.emit('message', 'A user has left the chat');
  });
});
// socket.on('join server', (username) => {
//   console.log('username is: ', username);
//   const user = {
//     username,
//     id: socket.id,
//   };
//   users.push(user);
//   io.emit('new users', users);
// });

// // socket.emit('message', 'Welcome to Matching Service');
// // message is a string
// // Listen for message

// // socket.on('message', ({ data }) => {
// //   console.log(data);
// //   // broadcast to all clients listening to this event
// //   io.emit('message', `${data} from ${socket.id}`);
// // });

// // socket.emit('message');
// // socket.on('messa')
// // Broadcast when a user connects
// // inform everyone(all other clients) except user thats connecting
// // socket.broadcast.emit('message', 'A user has joined the chat');

// // emit to all the clients
// // io.emit()
// socket.on('connect', () => {
//   socket.emit('message', 'connected to server');
//   // io.emit('message', 'A user has joined the chat');
// });

// Room == socket id
// });

// TODO: Create a event listener 'match' that creates a new match in the database when provided with the
// TODO: Correct details (so dont use app, use socket instead?)
httpServer.listen(PORT, () => console.log(`matching-service listening on port ${PORT}`));
// app.listen(8002, () => console.log('matching-service listening on port 8002'));
// TODO: Create a socket.io server instance
// TODO: Log something to console upon socket connection for a sense
// TODO: Run matching-service and test connection by using Postman
// httpServer.listen(8001);
// Admin Dashboard for socket connections
instrument(io, { auth: false });
