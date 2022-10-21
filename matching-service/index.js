import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { createSocketIOServer } from './socket.js';
import {
  createMatchRequest,
  findMatchRequest,
  deleteMatchRequest,
  cancelMatchRequest,
  getMatchSession,
} from './controller/matching-controller.js';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());

const router = express.Router();
router.get('/', (_, res) => {
  res.send('Hello World from matching-service');
});

router.get('/request', findMatchRequest);
router.post('/request', createMatchRequest);
router.delete('/request', deleteMatchRequest);
router.get('/session/:sessionId', getMatchSession);
router.post('/cancel', cancelMatchRequest);

app.use('/api/match', router).all((_, res) => {
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
});

const PORT = process.env.PORT || 8001;

const httpServer = createServer(app);

createSocketIOServer(httpServer);

httpServer.listen(PORT, () => console.log(`matching-service listening on port ${PORT}`));
