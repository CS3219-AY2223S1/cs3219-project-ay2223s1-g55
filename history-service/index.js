import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());
import {
  listUserRecords,
  createRecord,
  listUserCompletedQuestions,
  getUserExperienceLevel,
  getUserCompletedDifficultiesCount,
  getUserCompletedMonthlyCount
} from './controller/record-controller.js';

const router = express.Router();

// Controller will contain all the History-defined Routes
router.get('/', (_, res) => res.send('History-service is up and running!'));
router.get('/records/:username', listUserRecords);
router.post('/records/:username', createRecord);
router.get('/completed/:username', listUserCompletedQuestions);
router.get('/completed/difficultyCount/:username', getUserCompletedDifficultiesCount);
router.get('/completed/monthCount/:username', getUserCompletedMonthlyCount);
router.get('/experience/:username', getUserExperienceLevel);

app.use('/api/history', router).all((_, res) => {
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
});

app.listen(process.env.PORT || 8003, () => console.log(`history-service listening on port ${process.env.PORT || 8003}`));

export default app
