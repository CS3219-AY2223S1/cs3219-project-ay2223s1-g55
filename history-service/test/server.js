import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';

const BASE_PATH = '/api/history'

chai.use(chaiHttp);

const makeRequest = () => chai.request(app)
const get = (url) => makeRequest().get(url)

export const getIndex = () => get(BASE_PATH).send();
export const getUserRecords = username => get(`${BASE_PATH}/records/${username}`).send()
export const getUserCompletedQuestions = username => get(`${BASE_PATH}/completed/${username}`).send()
export const getUserExperience = username => get(`${BASE_PATH}/experience/${username}`).send()
