// prettier-ignore
const URI_USER_SVC = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000'
    : 'https://user-service-q563p73okq-as.a.run.app';
const URI_MATCHING_SVC = process.env.URI_USER_SVC || 'http://localhost:8001';

const PREFIX_USER_SVC = '/api/user';

export const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC;
export const URL_USER_LOGIN = `${URL_USER_SVC}/login`;
export const URL_USER_SESSION = `${URL_USER_SVC}/session`;
export const URL_USER_LOGOUT = `${URL_USER_SVC}/logout`;

const PREFIX_MATCHING_SVC = '/api/match';
export const URL_MATCHING_SVC = URI_MATCHING_SVC + PREFIX_MATCHING_SVC;
export const URL_MATCHING_REQUEST = `${URL_MATCHING_SVC}/request`;
