import mongoose from 'mongoose';

const { Schema } = mongoose;
const MatchingModelSchema = new Schema({
  // username1 only can have one pending match at any one time until deleted
  difficulty: {
    type: String,
    required: true,
  },
  isMatched: {
    type: Boolean,
    required: true,
  },
  username1: {
    type: String,
    required: true,
    unique: true,
  },
  username1socketID: {
    type: String,
    required: true,
    unique: true,
  },
  username2: {
    type: String,
    required: false,
    unique: false,
  },
  username2socketID: {
    type: String,
    required: false,
    unique: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isCancelled: {
    type: Boolean,
    default: false,
  },
});

// remove TTL so that it can be deleted properly
// MatchingModelSchema.path('createdAt').index({ expireAfterSeconds: 60 });

const MatchSessionModelSchema = new Schema({
  // not unique because can have many different matchSessions
  difficulty: {
    type: String,
    required: true,
  },
  username1: {
    type: String,
    required: true,
    unique: false,
  },
  username1socketID: {
    type: String,
    required: true,
    unique: false,
  },
  username2: {
    type: String,
    required: true,
    unique: false,
  },
  username2socketID: {
    type: String,
    required: true,
    unique: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // ! MatchRoomID will be the object id of the matchSession
  // matchRoomId: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },
});

export const MatchingModel = mongoose.model('MatchingModel', MatchingModelSchema);
export const MatchSessionModel = mongoose.model('MatchSessionModel', MatchSessionModelSchema);

// ! Use either MatchingModel id as RoomID or MatchSessionModel id as RoomID
