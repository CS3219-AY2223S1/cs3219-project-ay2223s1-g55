// prettier-ignore
const URI_USER_SVC = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000'
    : 'https://user-service-q563p73okq-as.a.run.app';
const URI_MATCHING_SVC = process.env.URI_USER_SVC || 'http://localhost:8001';
const URI_QUESTION_SVC = process.env.URI_QUESTION_SVC || 'http://localhost:8002';

const PREFIX_USER_SVC = '/api/user';

export const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC;
export const URL_USER_LOGIN = `${URL_USER_SVC}/login`;
export const URL_USER_SESSION = `${URL_USER_SVC}/session`;
export const URL_USER_LOGOUT = `${URL_USER_SVC}/logout`;

const PREFIX_MATCHING_SVC = '/api/match';
export const URL_MATCHING_SVC = URI_MATCHING_SVC + PREFIX_MATCHING_SVC;
export const URL_MATCHING_MATCH = `${URL_MATCHING_SVC}/match`;

const PREFIX_QUESTION_SVC = '/api/question';
export const URL_QUESTION_SVC = URI_QUESTION_SVC + PREFIX_QUESTION_SVC;
