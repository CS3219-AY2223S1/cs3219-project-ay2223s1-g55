import EditorModel from './editor-model.js';
import 'dotenv/config.js';

// Set up mongoose connection
import mongoose from 'mongoose';

const mongoDB = process.env.ENV == 'PROD' ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, {
  dbname: 'editor-service',
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const defaultValue = '';

export default async function findOrCreateEditor(id) {
  if (id == null) return {};
  const editor = await EditorModel.findById(id);
  if (editor) {
    return editor;
  }
  return EditorModel.create({
    _id: id,
    username_first: 'a',
    username_second: 'b',
    session_id: 'aa',
    // TODO: Figure out algorithm to select question and link with matching
    question: 'Two Sum',
    data: defaultValue,
  });
}
