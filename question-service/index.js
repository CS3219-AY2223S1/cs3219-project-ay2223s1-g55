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

const router = express.Router();

// Controller will contain all the User-defined Routes
router.get('/', getQuestions);
router.post('/', addQuestion);
router.get('/:title', getQuestionByTitle);
router.post('/:title', addComment);

app.use('/api/question', router).all((_, res) => {
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
});

app.listen(process.env.PORT || 8002, () =>
  console.log(`question-service listening on port ${process.env.PORT || 8002}`)
);
