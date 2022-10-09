import mongoose from 'mongoose';

const { Schema } = mongoose;
const QuestionModelSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard'],
  },
  examples: {
    type: [String],
    required: true,
  },
  constraints: {
    type: [String],
    required: true,
  },
});

export default mongoose.model('QuestionModel', QuestionModelSchema);
