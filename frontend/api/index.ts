import { URL_HISTORY_COMPLETED, URL_HISTORY_RECORD, URL_QUESTION_SVC } from '@/lib/configs';
import { QuestionType, IHistoryRecord } from '@/lib/types';
import { get } from './base';

// Question Service
export const getAllQuestions = async () => {
  return (await get<{ questions: QuestionType[] }>(URL_QUESTION_SVC)).questions;
};

export const getQuestions = async (difficulty: string) => {
  return (
    await get<{ questions: QuestionType[] }>(URL_QUESTION_SVC, { queryParams: { difficulty } })
  ).questions;
};

// History Service
export const getAllRecords = (username: string) => {
  return get<IHistoryRecord[]>(URL_HISTORY_RECORD, {
    queryParams: { limit: 10 },
    urlParams: { username },
  });
};

export const getAllCompletedQuestions = (username: string) => {
  return get<string[]>(URL_HISTORY_COMPLETED, { urlParams: { username } });
};
