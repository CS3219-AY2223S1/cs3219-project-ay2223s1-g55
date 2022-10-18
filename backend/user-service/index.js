import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());
import {
  createUser,
  loginUser,
  getSession,
  logoutUser,
  deleteUser,
  updateUser,
} from './controller/user-controller.js';

const router = express.Router();

// Controller will contain all the User-defined Routes
router.get('/', (_, res) => res.send('Hello World from user-service'));
router.post('/', createUser);
router.delete('/', deleteUser);
router.post('/login', loginUser);
router.get('/session', getSession);
router.post('/logout', logoutUser);
router.put('/', updateUser);

app.use('/api/user', router).all((_, res) => {
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
});

app.listen(process.env.PORT || 8000, () => console.log(`user-service listening on port ${process.env.PORT || 8000}`));