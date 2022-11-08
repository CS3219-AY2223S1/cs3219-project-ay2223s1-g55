import {
  URL_HISTORY_COMPLETED,
  URL_HISTORY_EXPERIENCE,
  URL_HISTORY_RECORD,
  URL_QUESTION_QUESTIONS,
} from '@/lib/configs';
import { QuestionType, IHistoryRecord, IExperience } from '@/lib/types';
import { get } from './base';

// Question Service
export const getAllQuestions = async () => {
  return (await get<{ questions: QuestionType[] }>(URL_QUESTION_QUESTIONS)).questions;
};

export const getQuestions = async (difficulty: string) => {
  return (
    await get<{ questions: QuestionType[] }>(URL_QUESTION_QUESTIONS, {
      queryParams: { difficulty },
    })
  ).questions;
};

// History Service
export const getAllRecords = (username: string, limit = 0) => {
  return get<IHistoryRecord[]>(URL_HISTORY_RECORD, {
    queryParams: { limit },
    urlParams: { username },
  });
};

export const getAllCompletedQuestions = (username: string) => {
  return get<string[]>(URL_HISTORY_COMPLETED, { urlParams: { username } });
};

export const getExperience = (username: string) => {
  return get<IExperience>(URL_HISTORY_EXPERIENCE, { urlParams: { username } });
};
