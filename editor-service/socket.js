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
      origin: [process.env.LOCAL_URL, process.env.DEPLOYMENT_URL, process.env.ADMIN_URL],
      credentials: true,
    },
  });

  instrument(socket, {
    auth: false,
  });

  socket.on(IO_EVENT.CONNECTION, (clientSocket) => {
    console.log('New WS Connection...', clientSocket.id);

    clientSocket.on('get-editor', async (editorId) => {
      // retrive data
      const editor = await ormFindOrCreateEditor(editorId);
      // check if editorId is legit for this user
      // check()
      clientSocket.join(editorId);
      clientSocket.emit('load-editor', editor.data);

      clientSocket.on('send-changes', (delta) => {
        clientSocket.broadcast.to(editorId).emit('receive-changes', delta);
      });
      clientSocket.on('alert-disconnected', (msg) => {
        clientSocket.broadcast.to(editorId).emit('alert-disconnected', msg);
      });

      clientSocket.on('save-editor', async (data) => {
        await ormFindEditorAndUpdate(editorId, data);
      });
    });
  });
};

export default socketInitializer;
