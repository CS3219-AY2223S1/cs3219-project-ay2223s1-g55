const URI_USER_SVC = process.env.PUBLIC_ENV_URI_USER_SVC || 'http://localhost:8000';

const PREFIX_USER_SVC = '/api/user';

export const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC;
export const URL_USER_LOGIN = `${URL_USER_SVC}/login`;
export const URL_USER_SESSION = `${URL_USER_SVC}/session`;
export const URL_USER_LOGOUT = `${URL_USER_SVC}/logout`;
