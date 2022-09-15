import mongoose from 'mongoose';

const { Schema } = mongoose;
const MatchingModelSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  socketID: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // password: {
  //   type: String,
  //   required: true,
  // },
});

MatchingModelSchema.path('createdAt').index({ expireAfterSeconds: 60 });

export default mongoose.model('MatchingModel', MatchingModelSchema);
