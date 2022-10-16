import DocumentModel from './document-model.js';
import 'dotenv/config.js';

// Set up mongoose connection
import mongoose from 'mongoose';

const mongoDB = process.env.ENV == 'PROD' ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const defaultValue = '';

export default async function findOrCreateDocument(id) {
  if (id == null) return {};

  const document = await DocumentModel.findById(id);
  if (document) {
    return document;
  }
  return DocumentModel.create({
    _id: id,
    username_first: 'a',
    username_second: 'b',
    session_id: 'aa',
    data: defaultValue,
  });
}
