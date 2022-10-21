/**
 * When adding new URLs, feel free to add the entire url with the url params included,
 * for example `/user/:username/records`.
 *
 * Our 'get' methods will automatically detect the 'username' parameter provided during the function
 * call and replace the ':username' portion of the url with the supplied username string.
 */
const URI_USER_SVC = process.env.NEXT_PUBLIC_URI_USER_SVC || 'http://localhost:8000';
export const URI_MATCHING_SVC = process.env.NEXT_PUBLIC_URI_MATCHING_SVC || 'http://localhost:8001';
const URI_QUESTION_SVC = process.env.NEXT_PUBLIC_URI_QUESTION_SVC || 'http://localhost:8002';
const URI_HISTORY_SVC = process.env.NEXT_PUBLIC_URI_HISTORY_SVC || 'http://localhost:8003';
export const URI_EDITOR_SVC = process.env.NEXT_PUBLIC_URI_EDITOR_SVC || 'http://localhost:8004';
export const URI_COMMUNICATION_SVC =
  process.env.NEXT_PUBLIC_URI_COMMUNICATION_SVC || 'http://localhost:8005';

const PREFIX_USER_SVC = '/api/user';
export const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC;
export const URL_USER_LOGIN = `${URL_USER_SVC}/login`;
export const URL_USER_SESSION = `${URL_USER_SVC}/session`;
export const URL_USER_LOGOUT = `${URL_USER_SVC}/logout`;

const PREFIX_MATCHING_SVC = '/api/match';
export const URL_MATCHING_SVC = URI_MATCHING_SVC + PREFIX_MATCHING_SVC;
export const URL_MATCHING_MATCH = `${URL_MATCHING_SVC}/match`;
export const URL_MATCHING_REQUEST = `${URL_MATCHING_SVC}/request`;
export const URL_MATCHING_CANCEL = `${URL_MATCHING_SVC}/cancel`;
export const URL_MATCHING_SESSION = `${URL_MATCHING_SVC}/sessions`;

const PREFIX_COMMUNICATION_SVC = '/api/communication';
export const URL_COMMUNICATION_SVC = URI_COMMUNICATION_SVC + PREFIX_COMMUNICATION_SVC;
export const URL_COMMUNICATION_MESSAGE = `${URL_COMMUNICATION_SVC}/message`;

const PREFIX_QUESTION_SVC = '/api/question';
export const URL_QUESTION_SVC = URI_QUESTION_SVC + PREFIX_QUESTION_SVC;

const PREFIX_HISTORY_SVC = '/api/history';
export const URL_HISTORY_SVC = URI_HISTORY_SVC + PREFIX_HISTORY_SVC;
export const URL_HISTORY_RECORD = `${URL_HISTORY_SVC}/records/:username`;
export const URL_HISTORY_COMPLETED = `${URL_HISTORY_SVC}/completed/:username`;
export const URL_HISTORY_EXPERIENCE = `${URL_HISTORY_SVC}/experience/:username`;
