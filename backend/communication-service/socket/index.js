import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { ormCreateMessage as _createMessage } from "../model/message-orm.js";

export const createSocketIOServer = (httpServer) => {
  const io = new Server(httpServer, {
    // Edit here to include new URL to access socket
    cors: {
      origin: ["http://localhost:3000", "https://admin.socket.io", "https://frontend-git-combine-services-cs-3219-g55.vercel.app"],
      credentials: true,
    },
  });

  // Run when client connects
  io.on("connection", (socket) => {
    console.log("New WS Connection...", socket.id);

    // announcement when user connects
    socket.emit("message", "Welcome to Server!");

    // TODO: FetchAllRoomMessages to after the person just join, if no messages yet(sessionId dont exists in collection) send empty array
    // Assuming no private messaging only messaging through a room now
    // TODO: on need (arg) but emit is arg1, arg2 instead
    socket.on(
      "roomMessage",
      async (content, senderId, senderName, sessionId, createdAt) => {
        console.log(
          `roomMessage event from payload content is ${sessionId}`,
          senderName
        );

        io.in(sessionId).emit(
          "receiveMessage",
          content,
          senderId,
          senderName,
          sessionId,
          createdAt
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
  });

  // Admin Dashboard for socket connections, use https://admin.socket.io to access
  instrument(io, { auth: false });
};
