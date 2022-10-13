import mongoose from 'mongoose';

const { Schema } = mongoose;
const DocumentModelSchema = new Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  session_id: {
    type: String,
    required: true,
  },
  username_first: {
    type: String,
    required: true,
  },
  username_second: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
});

export default mongoose.model('DocumentModel', DocumentModelSchema);
