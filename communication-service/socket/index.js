import {Server} from "socket.io";
import {instrument} from "@socket.io/admin-ui";
import {ormCreateMessage as _createMessage} from "../model/message-orm.js";

export const createSocketIOServer = (httpServer) => {
  const io = new Server(httpServer, {
    // Edit here to include new URL to access socket
    cors: {
      origin: [
        process.env.LOCAL_URL,
        process.env.DEPLOYMENT_URL,
        process.env.SOCKET_ADMIN_URL,
      ],
      credentials: true,
    },
  });

  // Run when client connects
  io.on("connection", (socket) => {
    console.log("New WS Connection...", socket.id);

    // announcement when user connects
    socket.emit("message", "Welcome to Server!");
    // See which client socket has disconnected
    socket.on("disconnect", () => {
      console.log("Client disconnected: ", socket.id);
    });

    // Assuming no private messaging only messaging through a room now
    // TODO: on need (arg) but emit is arg1, arg2 instead
    socket.on(
      "roomMessage",
      async (content, senderId, senderName, sessionId, createdAt, id) => {
        console.log(
          `roomMessage event from payload content is ${sessionId}`,
          senderName,
          id
        );

        io.in(sessionId).emit(
          "receiveMessage",
          content,
          senderId,
          senderName,
          sessionId,
          createdAt,
          id
        );
      }
    );

    socket.on("joinRoom", (sessionId, username, userId) => {
      console.log(
        "joinRoom event from payload content is ",
        sessionId,
        username,
        userId
      );
      socket.join(sessionId);
      io.in(sessionId).emit("joinRoomSuccess", sessionId, username, userId);
    });

    // socket.on("leaveRoom", (sessionId, username, userId) => {
    //   console.log(
    //     "leaveRoom event from payload content is ",
    //     sessionId,
    //     username,
    //     userId
    //   );
    //   socket.leave(sessionId);
    //   io.in(sessionId).emit("leaveRoomSuccess", sessionId, username, userId);
    // });

    // socket.on("disconnecting", () => {
    //   console.log(socket.rooms);
    //   for (const room of socket.rooms) {
    //     if (room !== socket.id) {
    //       io.to(room).emit("leaveRoom", room, socket.id);
    //     }
    //   }
    //   // the Set contains at least the socket ID
    // });
  });

  // Admin Dashboard for socket connections, use https://admin.socket.io to access
  instrument(io, {auth: false});
};
