import UserModel from './user-model.js';
import 'dotenv/config.js';
import redis from 'redis';

// Set up mongoose connection
import mongoose from 'mongoose';

const mongoDB = process.env.ENV == 'PROD' ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const redisUri =
  process.env.ENV == 'PROD' ? process.env.REDIS_CLOUD_URI : process.env.REDIS_LOCAL_URI;
const redisPort =
  process.env.ENV == 'PROD' ? process.env.REDIS_CLOUD_PORT : process.env.REDIS_LOCAL_PORT;
const redisPassword =
  process.env.ENV == 'PROD' ? process.env.REDIS_CLOUD_PASSWORD : process.env.REDIS_LOCAL_PASSWORD;

const redisClient = redis.createClient({
  socket: { host: redisUri, port: redisPort },
  password: redisPassword,
});
(async () => {
  redisClient.connect();
})();
redisClient.on('error', (err) => console.error(console, `Redis connection error: ${err}`));
redisClient.on('connect', () => console.log('Redis client connected!'));

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

export async function blacklistUser(token) {
  await redisClient.lPush('blacklist_jwt', token);
  return;
}

export async function findToken(token) {
  let tokens = [];

  try {
    const res = await redisClient.lRange('blacklist_jwt', 0, -1);
    res.forEach((t) => (tokens = [...tokens, t]));
    return tokens.includes(token);
  } catch (err) {
    console.error(err);
  }
}

export async function updateUser(username, newPassword) {
  try {
    const filter = { username };
    const update = { password: newPassword };
    const doc = await UserModel.findOneAndUpdate(filter, update);
    return doc;
  } catch (err) {
    console.log(err);
    return err;
  }
}
