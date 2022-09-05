import UserModel from './user-model.js';
import 'dotenv/config';

//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB =
  process.env.ENV == 'PROD'
    ? process.env.DB_CLOUD_URI
    : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export async function createUser(params) {
  return new UserModel(params);
}

export async function findUser(username) {
  const foundUser = await UserModel.findOne({ username: username });
  return foundUser;
}

export async function loginUser(params) {
  const user = await UserModel.findOne(params);
  return user;
}

export async function logoutUser(params) {
  const user = await UserModel.findOne(params);
  return user;
}

export async function deleteUser(params) {
    await UserModel.deleteOne(params);
    return;
}
