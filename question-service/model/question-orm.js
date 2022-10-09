import { addQuestion, findQuestion, getQuestions } from './repository.js';

export const ormAddQuestion = async (params) => {
  try {
    const question = await addQuestion(params);
    question.save();

    return true;
  } catch (err) {
    console.error('ERROR: Could not add question');
    return { err };
  }
};

export const ormCheckQuestionExists = async (title) => {
  try {
    const question = await findQuestion(title);
    return question != null;
  } catch (err) {
    console.error('ERROR: Error occured when finding question');
    return { err };
  }
};

export const ormGetQuestions = async (params) => {
  try {
    const questions = await getQuestions(params);
    return questions;
  } catch (err) {
    console.error('ERROR: Could not retrieve question list');
    return { err };
  }
};
