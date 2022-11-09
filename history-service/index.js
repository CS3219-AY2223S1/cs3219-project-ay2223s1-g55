import express from 'express';
import cors from 'cors';
const app = express();

import {
  listUserRecords,
  createRecord,
  listUserCompletedQuestions,
  getUserExperienceLevel,
  getUserCompletedDifficultiesCount,
  getUserCompletedMonthlyCount,
} from './controller/record-controller.js';
import verifyToken from './utils/verifyToken.js';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());
const router = express.Router();

// app.use(verifyToken);
// Controller will contain all the History-defined Routes
router.get('/', (_, res) => res.send('History-service is up and running!'));

// Protected Routes
router.get('/records/:username', verifyToken, listUserRecords);
router.post('/records/:username', verifyToken, createRecord);
router.get('/completed/:username', verifyToken, listUserCompletedQuestions);
router.get('/completed/difficultyCount/:username', verifyToken, getUserCompletedDifficultiesCount);
router.get('/completed/monthCount/:username', verifyToken, getUserCompletedMonthlyCount);
router.get('/experience/:username', verifyToken, getUserExperienceLevel);

app.use('/api/history', router).all((_, res) => {
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
});

app.listen(process.env.PORT || 8003, () =>
  console.log(`history-service listening on port ${process.env.PORT || 8003}`)
);

export default app;
