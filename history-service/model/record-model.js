import mongoose from 'mongoose'

const { Schema } = mongoose;
const RecordModelSchema = new Schema({
    questionId: {
        type: Number,
        required: true,
    },
    firstUserId: {
        type: Number,
        required: true,
    },
    secondUserId: {
        type: Number,
        required: true,
    },
    questionName: String,
    firstUserName: String,
    secondUserName: String,
    startedAt: {
        type: Date,
        default: Date.now(),
    },
    duration: Number,
})

const historyServiceDb = mongoose.connection.useDb('historyServiceDB');

export default historyServiceDb.model('RecordModel', RecordModelSchema);
