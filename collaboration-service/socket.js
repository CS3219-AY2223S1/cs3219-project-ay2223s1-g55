import { instrument } from '@socket.io/admin-ui';
import { Server } from 'socket.io';
// import { instrument } from '@socket.io/admin-ui';
import { IO_EVENT, EMIT_EVENT, ON_EVENT } from './libs/constants.js';
import DocumentModel from './model/document-model.js';
import findOrCreateDocument from './model/repository.js';

let socket;
const socketInitializer = (httpServer) => {
  socket = new Server(httpServer, {
    // Edit here to include new URL to access socket
    cors: {
      origin: ['http://localhost:3000', 'https://admin.socket.io'],
      credentials: true,
    },
  });

  instrument(socket, {
    auth: false,
  });

  socket.on(IO_EVENT.CONNECTION, (clientSocket) => {
    console.log('New WS Connection...', clientSocket.id);

    clientSocket.on('get-document', async (documentId) => {
      // retrive data
      const document = await findOrCreateDocument(documentId);
      // check if documentId is legit for this user
      // check()
      clientSocket.join(documentId);
      clientSocket.emit('load-document', document.data);

      clientSocket.on('send-changes', (delta) => {
        clientSocket.broadcast.to(documentId).emit('receive-changes', delta);
      });

      clientSocket.on('save-document', async (data) => {
        console.log(data);
        await DocumentModel.findByIdAndUpdate(documentId, { data });
      });
    });
  });
};

export default socketInitializer;
