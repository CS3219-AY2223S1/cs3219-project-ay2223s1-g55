import {Server} from "socket.io";
import {instrument} from "@socket.io/admin-ui";
import {IO_EVENT, EMIT_EVENT, ON_EVENT} from "../lib/constants.js";

export const createSocketIOServer = (httpServer) => {
  const io = new Server(httpServer, {
    // Edit here to include new URL to access socket
    cors: {
      origin: ["http://localhost:3000", "https://admin.socket.io"],
      credentials: true,
    },
  });
  // TODO: Room/Namespace and Message management

  // disabled middleware to check username and allow connection
  // socketIOServer.use((socket, next) => {
  //   const username = socket.handshake.auth.username;
  //   if (!username) {
  //     return next(new Error('invalid username'));
  //   }
  //   socket.username = username;
  //   next();
  // });

  // Run when client connects
  io.on(IO_EVENT.CONNECTION, (socket) => {
    // static id everytime we refresh page
    // const id = socket.handshake.query.id;
    // socket.join(id);
    console.log("New WS Connection...", socket.id);

    // announcement when user connects
    socket.emit(EMIT_EVENT.MESSAGE, "Welcome to Server!");

    // TODO: JOIN_ROOM, LEAVE_ROOM
    // callback function from client side
    socket.on(ON_EVENT.JOIN_ROOM, ({username, sessionId}, callback) => {
      console.log("server received join Room", sessionId + " " + username);
      // TODO: Retrieve all messages in room and send to client on join_room
      // TODO: If no messages, send empty array
      // TODO: Connect socket to room with sessionId
      socket.join(sessionId);

      // Callback from server side into client side.
      callback(`${username} joined room ${sessionId}`);

      const payload = {
        message: `${username} has joined the room ${sessionId}`,
        username: `${username}`,
      };
      const user = {
        username,
        id: socket.id,
        matchRoomID: `${sessionId}`,
      };

      // TODO: Send to everyone in room that user has joined the room
      socket.to(sessionId).emit(EMIT_EVENT.JOIN_ROOM, payload);
    });

    //! Assuming no private messaging only messaging through a room now
    // TODO: on need (arg) but emit is arg1, arg2 instead
    socket.on("roomMessage", (content, sender, senderName, sessionId) => {
      // const ({content : string, sender : string, senderName : string, sessionId : string}) = data;
      console.log(
        `roomMessage event from payload content is ${sessionId}`,
        socket.id
      );

      io.in(sessionId).emit(
        "receiveMessage",
        content,
        sender,
        senderName,
        sessionId
      );
    });

    socket.on("joinRoom", (sessionId, username, userId) => {
      console.log(
        "joinRoom event from payload content is ",
        sessionId,
        username,
        userId
      );
      socket.join(sessionId);
      io.in(sessionId).emit("joinRoomSuccess");
    });
    socket.on(ON_EVENT.SEND_MESSAGE, (data) => {
      // createdAt field only present after created in mongoDB collection in client side
      const {sessionId, senderName, senderId, message, createdAt} = data;

      console.log(`send-message event'payload content is ${data.message}`);

      // Send to all clients in room except the sender
      socket.to(sessionId).emit(EMIT_EVENT.SEND_MESSAGE, data);
    });

    // callback function from client side
    socket.on(ON_EVENT.JOIN_ROOM, ({username, matchRoomID}, callback) => {
      console.log("server received join Room", matchRoomID + " " + username);
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
    socket.on(ON_EVENT.LEAVE_ROOM, ({username, room}, callback) => {
      console.log("server received leave-room " + room + " " + username);
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
      io.to(room).emit(EMIT_EVENT.LEAVE_ROOM, payload);
    });

    socket.on(
      ON_EVENT.MATCH_FOUND,
      ({username, difficulty, mongodbID, roomSocketID}) => {
        console.log("server received match-found");
        const payload = {
          message: `${username} has found a match`,
          username,
          difficulty,
          mongodbID,
          roomSocketID,
        };
        // either use socket or socketIOServer, using socket need to join first
        io.to(roomSocketID).emit(EMIT_EVENT.MATCH_FOUND, payload);
        socket.join(mongodbID);
      }
    );

    //! Private Room Messaging
    socket.on(ON_EVENT.PRIVATE_MESSAGE, ({content, sender, receiver}) => {
      console.log("server received private message");
      socket.to(receiver).emit(EMIT_EVENT.PRIVATE_MESSAGE, {
        content,
        sender,
        receiver,
      });
    });

    // Runs when client disconnects
    socket.on(ON_EVENT.DISCONNECT, () => {
      io.emit(EMIT_EVENT.MESSAGE, "A user has left the server");
    });
  });

  // Admin Dashboard for socket connections, use https://admin.socket.io to access
  instrument(io, {auth: false});
};
