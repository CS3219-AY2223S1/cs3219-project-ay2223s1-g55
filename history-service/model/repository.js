import 'dotenv/config.js';
import RecordModel from './record-model.js';
import { EXPERIENCE_POINTS } from '../lib/constants.js';
import { calculateUserExperienceLevel } from '../lib/helpers.js'

// Set up mongoose connection
import mongoose from 'mongoose';

const mongoDB = process.env.ENV == 'PROD' ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;
const dbName = process.env.ENV === 'test' ? 'testHistoryServiceDB' : 'historyServiceDB';

mongoose.connect(mongoDB, {
  dbname: dbName,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export async function getUserExperienceLevel(username) {
  const difficultiesCount = await RecordModel.aggregate([
    { $match: { $or: [{ firstUsername: username }, { secondUsername: username }] } },
    {
      $group: {
        _id: '$questionDifficulty',
        count: { $sum: 1 }
      }
    }
  ])
  const experiencePoints = difficultiesCount.reduce((prevExperience, difficultyCount) => {
    return prevExperience + EXPERIENCE_POINTS[`${difficultyCount._id}`] * difficultyCount.count
  }, 0);

  const experienceLevel = calculateUserExperienceLevel(experiencePoints);
  return { experienceLevel, experiencePoints }
}

export async function listUserRecords(username, options) {
  return await RecordModel.find({ $or: [{ firstUsername: username }, { secondUsername: username }] })
    .skip(options.offset)
    .limit(options.limit);
}

export async function createRecord(params) {
  return new RecordModel(params);
}

export async function listUserCompletedQuestions(username) {
  return await RecordModel
    .distinct('questionName', { $or: [{ firstUsername: username }, { secondUsername: username }] })
}
