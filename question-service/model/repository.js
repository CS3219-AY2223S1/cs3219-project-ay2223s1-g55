import QuestionModel from './question-model.js';
import 'dotenv/config.js';

// Set up mongoose connection
import mongoose from 'mongoose';

const mongoDB = process.env.ENV == 'PROD' ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export const addQuestion = async (params) => {
  return new QuestionModel(params);
};

export const findQuestion = async (title) => {
  const question = await QuestionModel.findOne({ title });
  return question;
};

export const getQuestions = async (params) => {
  const questions = await QuestionModel.find(params);
  return questions;
};
