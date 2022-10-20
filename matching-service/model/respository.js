import MatchingModel from './matching-model.js';
import MatchSessionModel from './match-session-model.js';
import 'dotenv/config.js';

// Set up mongoose connection
import mongoose from 'mongoose';

const mongoDB = process.env.ENV == 'PROD' ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

// TODO: dbname inside curly brace
mongoose.connect(mongoDB, {
  dbname: 'matchServiceDB',
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export async function createMatchRequest(params) {
  // { difficulty, isMatched, username1, user1RequestId, username2, user2RequestId }
  return new MatchingModel(params);
}

/**
 * Look for matchRequest and update matchRequest in the MatchingModel collection
 * @param { difficulty, isMatched, username1, user1RequestId,
 *        username2, user2RequestId } params
 * @returns { difficulty, isMatched, username1, user1RequestId,
 *         username2, user2RequestId }
 *        foundMatchRequest
 *        Updated matchRequest from MatchingModel collection
 */
export async function updateMatchRequest(params) {
  console.log('[respository] updateMatchRequest params', params);
  const filter = {
    difficulty: params.difficulty,
    username1: params.username1,
  };
  const update = {
    username2: params.username2,
    user2RequestId: params.user2RequestId,
    isMatched: true,
  };
  const updatedMatchRequest = await MatchingModel.findOneAndUpdate(filter, update, { new: true });
  console.log('[repository] Updated match request successfully: ', updatedMatchRequest.username2);
  // return true;
  return updatedMatchRequest;
}

/**
 * Look for matchRequest in the MatchingModel collection
 * @param { difficulty, username2 } params
 * @returns { difficulty, isMatched, username1, user1RequestId,
 *         username2, user2RequestId }
 *        foundMatchRequest
 *        The matchRequest from MatchingModel collection
 */
export async function findMatchRequest(params) {
  const foundMatchRequest = await MatchingModel.findOne({
    difficulty: params.difficulty,
    username1: { $ne: params.username2 },
    isMatched: false,
  });
  console.log('[respository.js] foundMatchRequest:', foundMatchRequest);
  return foundMatchRequest != null ? foundMatchRequest : false;
}

export async function checkMatchRequestIsMatched(params) {
  const isMatched = await MatchingModel.findOne({
    difficulty: params.difficulty,
    username1: params.username1,
    isMatched: true,
  });
  console.log('[respository.js] foundMatchRequest:', isMatched);
  return isMatched != null ? isMatched : false;
}

/**
 * Look for existing matchRequest in the MatchingModel collection
 * @param { difficulty, username1 } params
 * @returns { Boolean } true if matchRequest exists in MatchingModel collection
 */
export async function checkMatchRequestExists(params) {
  const foundMatchRequest = await MatchingModel.findOne({ username1: params.username });
  console.log('[respository.js] foundMatchRequest:', foundMatchRequest);
  return foundMatchRequest != null ? foundMatchRequest : false;
}

/**
 * delete PendingMatchRequest from MatchingModel collection
 * @param { difficulty, isMatched, username1, username2 } params
 * @returns
 */
export async function deleteMatchRequest(params) {
  if (params.isMatched) {
    await MatchingModel.deleteOne(params);
  }
  if (!params.isMatched) {
    const deleteRequest = await MatchingModel.deleteOne({
      difficulty: params.difficulty,
      username1: params.username,
    });
    console.log('[respository.js] deleteRequest:', deleteRequest);
  }
  return;
}

export async function cancelMatchRequest(params) {
  console.log('[respository] cancelMatchRequest params', params.isCancelled);
  const filter = {
    difficulty: params.difficulty,
    username1: params.username,
  };
  const update = {
    isCancelled: true,
  };
  const cancelledMatchRequest = await MatchingModel.findOneAndUpdate(filter, update, { new: true });
  console.log('[repository] Cancelled match request successfully: ', cancelledMatchRequest);
  // return true;
  return cancelledMatchRequest;
}

/**
 * Create MatchSession in MatchSessionModel collection
 * @param { difficulty, username1, user1RequestId, username2, user2RequestId } params
 * @returns { difficulty, username1, user1RequestId, username2, user2RequestId, _id } matchSession
 */
export async function createMatchSession(params) {
  console.log('[respository.js] createMatchSession params:', params);
  return new MatchSessionModel(params);
}

export async function findMatchSession(params) {
  console.log('[respository.js] findMatchSession params:', params);
  const foundMatchSession = await MatchSessionModel.findOne({
    difficulty: params.difficulty,
    username1: params.username1,
    user1RequestId: params.user1RequestId,
  });
  return foundMatchSession != null ? foundMatchSession : false;
}
