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
    type: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
        explanation: { type: String, required: false },
      },
    ],
    required: true,
  },
  constraints: {
    type: [String],
    required: true,
  },
  comments: [
    {
      user: {
        type: String,
        required: true,
      },
      comment: { type: String, required: true },
      created_at: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

export default mongoose.model('QuestionModel', QuestionModelSchema);
