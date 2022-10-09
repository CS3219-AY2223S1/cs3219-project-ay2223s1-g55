import { Server } from 'socket.io';
// import { instrument } from '@socket.io/admin-ui';
import { IO_EVENT, EMIT_EVENT, ON_EVENT } from './libs/constants.js';

let socket;
const socketInitializer = (httpServer) => {
  socket = new Server(httpServer, {
    // Edit here to include new URL to access socket
    cors: {
      origin: ['http://localhost:3000', 'https://admin.socket.io'],
      credentials: true,
    },
  });

  socket.on(IO_EVENT.CONNECTION, (clientSocket) => {
    console.log('New WS Connection...', clientSocket.id);
  });

  socket.on('send-changes', (delta) => {
    console.log('can sense');
    console.log(delta);
  });
};

export default socketInitializer;
