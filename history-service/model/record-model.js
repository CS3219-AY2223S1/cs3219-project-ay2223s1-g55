import mongoose from 'mongoose'

const { Schema } = mongoose;
const RecordModelSchema = new Schema({
    questionName: {
        type: String,
        required: true,
    },
    firstUsername: {
        type: String,
        required: true,
    },
    secondUsername: {
        type: String,
        required: true
    },
    startedAt: {
        type: Date,
        default: Date.now(),
    },
    duration: Number,
})

export default mongoose.model('RecordModel', RecordModelSchema);
