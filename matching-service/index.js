import express from 'express';
import cors from 'cors';
// Used to create socket.io
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());

app.get('/', (req, res) => {
  res.send('Hello World from matching-service');
});

const PORT = process.env.PORT || 8001;

const httpServer = createServer(app);
const io = new Server(httpServer);

// Run when clinet connects
io.on('connection', (socket) => {
  console.log('New WS Connection...');
  // OPEN BIDIRECTIONAL COMMUNICATION
  // emit to the single client that is connecting
  socket.emit('message', 'Welcome to Matching Service');

  // Broadcast when a user connects
  // inform everyone(all other clients) except user thats connecting
  socket.broadcast.emit('message', 'A user has joined the chat');

  // emit to all the clients
  // io.emit()

  // Runs when client disconnects
  socket.on('disconnect', () => {
    io.emit('message', 'A user has left the chat');
  });
});

httpServer.listen(PORT, () => console.log(`matching-service listening on port ${PORT}`));

// TODO: Create a socket.io server instance
// TODO: Log something to console upon socket connection for a sense
// TODO: Run matching-service and test connection by using Postman
// httpServer.listen(8001);
