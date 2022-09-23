import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import { IO_EVENT, EMIT_EVENT, ON_EVENT } from './libs/constants.js';

let socketIOServer;
export const createSocketIOServer = (httpServer) => {
  socketIOServer = new Server(httpServer, {
    // Edit here to include new URL to access socket
    cors: {
      origin: ['http://localhost:3000', 'https://admin.socket.io'],
      credentials: true,
    },
  });
  // TODO: Room/Namespace and Message management
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
  socketIOServer.on(IO_EVENT.CONNECTION, (socket) => {
    // static id everytime we refresh page
    // const id = socket.handshake.query.id;
    // socket.join(id);
    console.log('New WS Connection...', socket.id);

    // announcement when user connects
    socket.emit(EMIT_EVENT.MESSAGE, 'Welcome to Server!');

    socket.on(ON_EVENT.SEND_MESSAGE, (data) => {
      const { content, sender, roomId, chatName } = data;
      console.log(`send-message event'payload content is ${data.content}`);
      if (roomId === '') {
        // Send globally to all listeners in socket
        socket.broadcast.emit(EMIT_EVENT.SEND_MESSAGE, data);
      } else {
        // Send to specific room
        socket.to(roomId).emit(EMIT_EVENT.RECEIVE_MESSAGE, data);
      }
    });

    // callback function from client side
    socket.on(ON_EVENT.JOIN_ROOM, ({ username, matchRoomID }, callback) => {
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
        matchRoomID: `${matchRoomID}`,
      };
      socket.emit(EMIT_EVENT.JOIN_ROOM_SUCCESS, user);
      socket.to(matchRoomID).emit(EMIT_EVENT.JOIN_ROOM, payload);
    });

    // TODO: Add leave-room-success event, and clear it on the frontend
    socket.on(ON_EVENT.LEAVE_ROOM, ({ username, room }, callback) => {
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
      socketIOServer.to(room).emit(EMIT_EVENT.LEAVE_ROOM, payload);
    });

    socket.on(ON_EVENT.MATCH_FOUND, ({ username, difficulty, mongodbID, roomSocketID }) => {
      console.log('server received match-found');
      const payload = {
        message: `${username} has found a match`,
        username,
        difficulty,
        mongodbID,
        roomSocketID,
      };
      // either use socket or socketIOServer, using socket need to join first
      socketIOServer.to(roomSocketID).emit(EMIT_EVENT.MATCH_FOUND, payload);
      socket.join(mongodbID);
    });

    // Runs when client disconnects
    socket.on(ON_EVENT.DISCONNECT, () => {
      socketIOServer.emit(EMIT_EVENT.MESSAGE, 'A user has left the server');
    });
  });

  // Admin Dashboard for socket connections, use https://admin.socket.io to access
  instrument(socketIOServer, { auth: false });
};
