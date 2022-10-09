import mongoose from 'mongoose'

const { Schema } = mongoose;
const RecordModelSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    userId: {
        type: Number,
        required: true,
        unique: false,
    }
})

const myDB = mongoose.connection.useDb('historyServiceDB');

export default myDB.model('RecordModel', RecordModelSchema);
