import mongoose from "mongoose";

const {Schema} = mongoose;
const MessageModelSchema = new Schema({
  sessionId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  senderName: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

export default mongoose.model("MessageModel", MessageModelSchema);
