import EditorModel from './editor-model.js';
import 'dotenv/config.js';

// Set up mongoose connection
import mongoose from 'mongoose';

const mongoDB = process.env.ENV == 'PROD' ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;
const dbName = process.env.ENV === 'testDB' ? 'test' : 'editorDB';

mongoose.connect(mongoDB, {
  dbname: dbName,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export async function findEditor(sessionId) {
  const foundEditor = await EditorModel.findOne({ session_id: sessionId });
  return foundEditor;
}

const defaultValue = '';
export async function createEditor(sessionId) {
  const editor = new EditorModel({
    session_id: sessionId,
    data: defaultValue,
  });
  editor.save();
  return editor;
}

export async function findEditorAndUpdate(sessionId, data) {
  try {
    const filter = { session_id: sessionId };
    const update = { data };
    const doc = await EditorModel.findOneAndUpdate(filter, update);
    return doc;
  } catch (err) {
    return err;
  }
}
