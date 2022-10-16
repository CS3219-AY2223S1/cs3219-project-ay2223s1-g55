import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import socketInitializer from './socket.js';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());

const router = express.Router();
router.get('/', (_, res) => {
  res.send('Hello World from collaboration-service');
});

app.use('/api/collaboration', router).all((_, res) => {
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
});

const PORT = process.env.PORT || 8002;

const httpServer = createServer(app);

socketInitializer(httpServer);

httpServer.listen(PORT, () => console.log(`collaboration-service listening on port ${PORT}`));
