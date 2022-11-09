const isProd = process.env.ENV == 'PROD';
const isTest = process.env.ENV == 'test';
const isTestOrProd = isProd || isTest;
const URI_QUESTION_SVC = isTestOrProd
  ? 'https://question-service-q563p73okq-as.a.run.app/'
  : 'http://localhost:8002';
const PREFIX_QUESTION_SVC = '/api/question';
export const URL_QUESTION_SVC = URI_QUESTION_SVC + PREFIX_QUESTION_SVC;
export const URL_QUESTION_QUESTIONS = `${URL_QUESTION_SVC}/question`;
