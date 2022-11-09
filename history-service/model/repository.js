import 'dotenv/config.js';
// eslint-disable-next-line import/no-extraneous-dependencies
import RecordModel from './record-model.js';
import { EXPERIENCE_POINTS } from '../lib/constants.js';
import { calculateUserExperienceLevel } from '../lib/helpers.js'

// Set up mongoose connection
import mongoose from 'mongoose';

const isProd = process.env.ENV === 'PROD';
const isTest = process.env.ENV === 'test';
const isProdOrTest = isProd || isTest;

const mongoDB = isProdOrTest ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;
const dbName = isTest ? 'testHistoryServiceDB' : 'historyServiceDB';

mongoose.connect(mongoDB, {
  dbname: dbName,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export async function getUserExperienceLevel(username) {
  const difficultiesCount = await RecordModel.aggregate([
    { $match: { $or: [{ firstUsername: username }, { secondUsername: username }] } },
    {
      $group: {
        _id: '$questionDifficulty',
        count: { $sum: 1 },
      },
    },
  ]);
  const experiencePoints = difficultiesCount.reduce((prevExperience, difficultyCount) => {
    return prevExperience + EXPERIENCE_POINTS[`${difficultyCount._id}`] * difficultyCount.count;
  }, 0);

  const experienceLevel = calculateUserExperienceLevel(experiencePoints);
  return { experienceLevel, experiencePoints }
}

export async function listUserRecords(username, options) {
  return await RecordModel.find({
    $or: [{ firstUsername: username }, { secondUsername: username }],
  })
    .skip(options.offset)
    .limit(options.limit);
}

export async function createRecord(params) {
  return new RecordModel(params);
}

export async function listUserCompletedQuestions(username) {
  return await RecordModel.distinct('questionName', {
    $or: [{ firstUsername: username }, { secondUsername: username }],
  });
}

export async function countUserCompletedQuestionsByMonth(username, limit = 12) {
  const data = await RecordModel.aggregate([
    {
      $match: { $or: [{ firstUsername: username }, { secondUsername: username }] },
    },
    {
      $group: {
        _id: { month: { $month: '$startedAt' }, year: { $year: '$startedAt' } }, // Group by month, year
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        month: '$_id.month',
        year: '$_id.year',
        count: '$count',
      },
    },
    { $sort: { year: -1, month: -1 } }, // Descending order, we want the latest counts
    { $limit: +limit }, // Limit number of months to retrieve
  ]);
  return data.reverse();
}

export async function countUserCompletedQuestionsByDifficulty(username) {
  const counts = await RecordModel.aggregate([
    {
      $match: {
        $or: [{ firstUsername: username }, { secondUsername: username }],
      },
    },
    {
      $group: {
        _id: `$questionDifficulty`,
        count: { $sum: 1 },
      },
    },
  ]);
  return counts.reduce((result, difficultyCount) => {
    return {
      ...result,
      [`${difficultyCount._id}`]: difficultyCount.count,
    };
  }, {});
}
