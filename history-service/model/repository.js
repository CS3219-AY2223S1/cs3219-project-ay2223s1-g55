import 'dotenv/config.js';
import RecordModel from './record-model.js';
import { EXPERIENCE_LEVEL, EXPERIENCE_POINTS } from '../lib/constants.js';

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

  let experienceLevel;
  if (experiencePoints > 1200) {
    experienceLevel = EXPERIENCE_LEVEL.elite
  } else if (experiencePoints > 600) {
    experienceLevel = EXPERIENCE_LEVEL.expert
  } else if (experiencePoints > 200) {
    experienceLevel = EXPERIENCE_LEVEL.novice
  } else {
    experienceLevel = EXPERIENCE_LEVEL.beginner
  }
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

export async function countUserCompletedQuestions(username, groupBy) {
  return await RecordModel.aggregate([
    {
      $match: {
        $or: [{ firstUsername: username }, { secondUsername: username }]
      }
    },
    {
      $group: {
        _id: `$${groupBy}`,
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        difficulty: '$_id',
        count: '$count'
      }
    }
  ])
}
