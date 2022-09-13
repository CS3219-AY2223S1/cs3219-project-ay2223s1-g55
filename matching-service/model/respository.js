import MatchingModel from './matching-model.js';
import 'dotenv/config.js';
import redis from 'redis';

// Set up mongoose connection
import mongoose from 'mongoose';

const mongoDB = process.env.ENV == 'PROD' ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export async function createMatchRequest(params) {
  return new MatchingModel(params);
}

export async function findMatchRequest(username) {
  const foundUser = await MatchingModel.findOne({ username: username });
  return foundUser;
}

export async function findMatch(params) {
  // within expiry time of 30s? hmmm
  console.log(`params are ${params.username} and ${params.difficulty}`);
  const foundUser = await MatchingModel.find({
    username: { $ne: params.username },
    difficulty: params.difficulty,
  });
  console.log('foundUser is: ', foundUser);
  if (foundUser.length == 0) {
    return false;
  }
  return foundUser[0];
}

export async function deleteMatchRequest(params) {
  console.log({ params });
  await MatchingModel.deleteOne(params);
  return;
}
