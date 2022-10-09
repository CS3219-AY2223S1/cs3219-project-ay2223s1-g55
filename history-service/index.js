import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());
import {
  listUserRecords,
  createRecord
} from './controller/record-controller.js';

const router = express.Router();

/**
 * Use cases
 * 1. User wants to see their own history
 * 2. User wants to see their completion page (lsit of completed questions)
 * 3. User wants to see the details for a specific record
 * 4. A record is logged after a user starts a session
 */

// Controller will contain all the History-defined Routes
router.get('/', (_, res) => res.send('History-service is up and running!'));
router.get('/user/:userId/records/', listUserRecords);
router.post('/user/:userId/records/', createRecord);

app.use('/api/history', router).all((_, res) => {
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
});

app.listen(process.env.PORT || 8002, () => console.log(`user-service listening on port ${process.env.PORT || 8002}`));
