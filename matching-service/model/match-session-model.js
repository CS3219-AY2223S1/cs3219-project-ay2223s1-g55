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
  user1RequestId: {
    type: String,
    required: true,
    unique: false,
  },
  username2: {
    type: String,
    required: true,
    unique: false,
  },
  user2RequestId: {
    type: String,
    required: true,
    unique: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('MatchSessionModel', MatchSessionModelSchema);
