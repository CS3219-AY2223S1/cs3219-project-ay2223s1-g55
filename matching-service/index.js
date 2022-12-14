import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import {
  findMatchRequest,
  deleteMatchRequest,
  cancelMatchRequest,
  getMatchSession,
} from './controller/matching-controller.js';
import verifyToken from './utils/verifyToken.js';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());

const router = express.Router();
router.get('/', (_, res) => {
  res.send('Hello World from matching-service');
});

// Protected Routes
router.post('/request', verifyToken, findMatchRequest);
router.delete('/request', verifyToken, deleteMatchRequest);
router.get('/sessions/:sessionId', verifyToken, getMatchSession);
router.post('/cancel', verifyToken, cancelMatchRequest);

app.use('/api/match', router).all((_, res) => {
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
});

const PORT = process.env.PORT || 8001;

const httpServer = createServer(app);

httpServer.listen(PORT, () => console.log(`matching-service listening on port ${PORT}`));

export default app;
