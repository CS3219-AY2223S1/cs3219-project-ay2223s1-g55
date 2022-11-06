import MessageModel from "./message-model.js";
import "dotenv/config.js";

// Set up mongoose connection
import mongoose from "mongoose";

const mongoDB =
  process.env.ENV == "PROD"
    ? process.env.DB_CLOUD_URI
    : process.env.DB_LOCAL_URI;
const dbName =
  process.env.ENV === "test" ? "testCommServiceDB" : "communicationServiceDB";

mongoose.connect(mongoDB, {
  dbname: dbName,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

export async function createMessage(params) {
  // { session_id, users, messages }
  return new MessageModel(params);
}

export async function checkSessionExists(params) {
  const foundSession = await MessageModel.findOne({
    sessionId: params.sessionId,
  });
  return foundSession != null;
}
export async function fetchAllMessages(params) {
  const foundMessages = await MessageModel.find({
    sessionId: params.sessionId,
  }).sort({createdAt: "ascending"});
  return foundMessages != null ? foundMessages : false;
}
