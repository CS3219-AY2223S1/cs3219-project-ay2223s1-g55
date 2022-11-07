import 'dotenv/config.js';
import mongoose from 'mongoose';

export const testDbConnect = async () => {
  mongoose.connect(process.env.DB_LOCAL_URI, {
    dbname: 'testQuestionsDb',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  let db = mongoose.connection;
  db.on('open', () => {
    console.log('**Test MongoDB connection established**');
  });
  db.on('error', () => {
    console.log('error connecting db test');
  });
};

export default testDbConnect;
