import {
  ormCreateMatchRequest as _createMatchRequest,
  ormFindMatch as _findMatch,
} from '../model/matching-orm.js';
// import { decodeBearerToken } from './helpers.js';
// import jwt from 'jsonwebtoken';

export async function createMatchRequest(req, res) {
  try {
    const { username, difficulty } = req.body;
    if (username && difficulty) {
      const resp = await _createMatchRequest(username, difficulty);
      console.log(resp);
      if (resp.err) {
        return res.status(400).json({ message: 'Could not create a new user!' });
      } else {
        console.log(`Created new user ${username} successfully!`);
        return res
          .status(201)
          .json({ message: `Created new match request for user ${username} successfully!` });
      }
    } else {
      return res.status(400).json({ message: 'Username and/or Password are missing!' });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: 'Database failure when creating new match request for user!' });
  }
}

export async function findMatch(req, res) {
  try {
    const { username, difficulty } = req.body;
    if (username && difficulty) {
      const resp = await _findMatch(username, difficulty);
      console.log(resp);
      if (resp.err) {
        return res.status(400).json({ message: 'Could not find match!' });
      } else {
        console.log(`Found match for user ${username} successfully!`);
        return res
          .status(201)
          .json({ message: `Completed match request for user ${username} successfully!` });
      }
    } else {
      return res.status(400).json({ message: 'Username and/or Difficulty level are missing!' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Database failure when looking for match for user!' });
  }
}

export async function getSession(req, res) {
  try {
    const currentUser = decodeBearerToken(req);

    if (!currentUser) {
      return res.status(401).send({ message: 'Invalid Bearer Token!' });
    }

    const { username, _id } = currentUser;

    const usernameExists = await _checkUserExists(username);
    if (!usernameExists) {
      return res.status(404).send({ message: 'Username not found!' });
    }

    console.log(`User ${username} logged in successfully!`);
    return res.status(200).send({
      message: `User session for ${username} found!`,
      _id,
      username,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to retrieve session!' });
  }
}
