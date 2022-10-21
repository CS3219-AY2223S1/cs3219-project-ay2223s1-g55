import { instrument } from '@socket.io/admin-ui';
import { Server } from 'socket.io';
// import { instrument } from '@socket.io/admin-ui';
import { IO_EVENT } from './libs/constants.js';
import { ormFindEditorAndUpdate, ormFindOrCreateEditor } from './model/editor-orm.js';

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
      const document = await ormFindOrCreateEditor(documentId);
      // check if documentId is legit for this user
      // check()
      clientSocket.join(documentId);
      clientSocket.emit('load-document', document.data);

      clientSocket.on('send-changes', (delta) => {
        clientSocket.broadcast.to(documentId).emit('receive-changes', delta);
      });

      clientSocket.on('save-document', async (data) => {
        await ormFindEditorAndUpdate(documentId, data);
      });
    });
  });
};

export default socketInitializer;
