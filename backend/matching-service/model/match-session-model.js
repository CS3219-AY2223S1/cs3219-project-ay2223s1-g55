import mongoose from 'mongoose';

const { Schema } = mongoose;
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

export default mongoose.model('MatchSessionModel', MatchSessionModelSchema);
