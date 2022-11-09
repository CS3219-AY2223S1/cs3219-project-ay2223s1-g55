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
  user1RequestId: {
    type: String,
    required: true,
    unique: true,
  },
  username2: {
    type: String,
    required: false,
    unique: false,
  },
  user2RequestId: {
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

export default mongoose.model('MatchingModel', MatchingModelSchema);
