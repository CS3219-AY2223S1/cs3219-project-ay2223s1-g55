import mongoose from 'mongoose';

const { Schema } = mongoose;
const EditorModelSchema = new Schema({
  session_id: {
    type: String,
    required: true,
    unique: true,
  },
  data: {
    type: Object,
    required: true,
  },
});

export default mongoose.model('EditorModel', EditorModelSchema);
