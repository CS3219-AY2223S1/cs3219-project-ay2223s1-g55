import 'dotenv/config.js';
import RecordModel from './record-model.js';

// Set up mongoose connection
import mongoose from 'mongoose';

const mongoDB = process.env.ENV == 'PROD' ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export async function getRecord() {
  const record = await RecordModel.find();
  return record;
}

export async function listUserRecords(userId, options) {
  return await RecordModel.find({ userId })
    .skip(options.offset)
    .limit(options.limit);
}

export async function createRecord(params) {
  return new RecordModel(params);
}
