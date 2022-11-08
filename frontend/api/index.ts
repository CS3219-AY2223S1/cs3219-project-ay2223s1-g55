/* eslint no-return-await */
import {
  URL_COMMUNICATION_MESSAGE,
  URL_HISTORY_COMPLETED,
  URL_HISTORY_COMPLETED_DIFFICULTY_COUNT,
  URL_HISTORY_COMPLETED_MONTHS_COUNT,
  URL_HISTORY_EXPERIENCE,
  URL_HISTORY_RECORD,
  URL_MATCHING_CANCEL,
  URL_MATCHING_REQUEST,
  URL_MATCHING_SESSION,
  URL_QUESTION_SVC,
  URL_USER_LOGIN,
  URL_USER_LOGOUT,
  URL_USER_SESSION,
  URL_USER_SVC,
  URL_QUESTION_QUESTIONS,
} from '@/lib/configs';
import {
  QuestionType,
  IHistoryRecord,
  IExperience,
  User,
  QuestionCommentType,
  Message,
} from '@/lib/types';
import { get, post, put, _delete } from './base';

// User Service
export const getUserSession = async () => {
  return await get<User>(URL_USER_SESSION);
};

export const loginUser = async (username: string, password: string, token: string) => {
  return await post<{ token: string }>(URL_USER_LOGIN, { username, password, token });
};

export const signUpUser = async (username: string, password: string) => {
  return await post<{ token: string }>(URL_USER_SVC, { username, password });
};

export const logoutUser = async () => {
  return await post(URL_USER_LOGOUT);
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
  return await put(URL_USER_SVC, { oldPassword, newPassword });
};

export const deleteUser = async () => {
  return await _delete(URL_USER_SVC);
};

// Match Service
export const getQuestionTitle = async (sessionId: string) => {
  const res = await get<{ data: { question: string } }>(`${URL_MATCHING_SESSION}/${sessionId}`);
  return res.data.question;
};

export const sendMatchRequest = async (username: string, difficulty: string, requestId: string) => {
  return await post<any>(URL_MATCHING_REQUEST, {
    username,
    difficulty,
    requestId,
  });
};

export const cancelMatchRequest = async (username: string, difficulty: string) => {
  return await post<any>(URL_MATCHING_CANCEL, {
    username,
    difficulty,
  });
};

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

export const getQuestionByTitle = async (questionTitle: string) => {
  return (await get<{ question: QuestionType }>(`${URL_QUESTION_SVC}/${questionTitle}`))
    .question?.[0];
};

export const getComments = async (questionTitle: string) => {
  return (
    (await get<{ question: QuestionType[] }>(`${URL_QUESTION_SVC}/${questionTitle}`)).question?.[0]
      ?.comments ?? []
  );
};

export const addComment = async (questionTitle: string, comment: QuestionCommentType) => {
  return await post(`${URL_QUESTION_SVC}/${questionTitle}`, comment);
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

export const getQuestionsCompletedByDifficultyCount = async (username: string) => {
  return await get(URL_HISTORY_COMPLETED_DIFFICULTY_COUNT, { urlParams: { username } });
};

export const getQuestionsCompletedByMonthCount = async (username: string) => {
  return await get(URL_HISTORY_COMPLETED_MONTHS_COUNT, { urlParams: { username } });
};

// Communication Service
export const getMessages = async (sessionId: string) => {
  const res = await get<{ messages: Message[] }>(`${URL_COMMUNICATION_MESSAGE}/${sessionId}`);
  return res.messages ?? [];
};

export const createMessage = async (
  sessionId: string,
  senderName: string,
  senderId: string,
  message: string
) => {
  const res = await post<{ data: Message }>(URL_COMMUNICATION_MESSAGE, {
    sessionId,
    senderName,
    senderId,
    message,
  });
  return res;
};
