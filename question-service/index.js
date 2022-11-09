import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());
import {
  addQuestion,
  getQuestions,
  getQuestionByTitle,
  addComment,
} from './controller/question-controller.js';
import verifyToken from './utils/verifyToken.js';

const router = express.Router();
// TODO: Add protected routes later
// Controller will contain all the User-defined Routes
router.get('/', (_, res) => res.send('Hello World from question-service'));
router.get('/question', getQuestions);
router.post('/question', addQuestion);
router.get('/question/:title', getQuestionByTitle);
router.post('/question/:title', addComment);

app.use('/api/question', router).all((_, res) => {
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
});

app.listen(process.env.PORT || 8002, () =>
  console.log(`question-service listening on port ${process.env.PORT || 8002}`)
);

export default app;
