import {
  ormCreateMatchRequest as _createMatchRequest,
  ormFindMatch as _findMatch,
  ormDeleteMatchRequest as _deleteMatchRequest,
  ormCheckMatchRequestExists as _checkMatchRequestExists,
} from '../model/matching-orm.js';
import { sleep } from '../utils/sleep.js';
// import { decodeBearerToken } from './helpers.js';
// import jwt from 'jsonwebtoken';

export async function createMatchRequest(req, res) {
  try {
    const { username, difficulty, roomSocketID } = req.body;
    if (username && difficulty && roomSocketID) {
      const resp = await _createMatchRequest(username, difficulty, roomSocketID);
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

// Need to find match for 30s at least
export async function findMatch(req, res) {
  let count = 0;
  console.log(`Running findMatch for ${count} time`);
  console.log('req.head for findMatch is', req.headers);
  try {
    const { username, difficulty, roomsocketid } = req.headers;
    if (username && difficulty && roomsocketid) {
      // TODO: Change this to on first findMatch if no result, insert into database
      // TODO: will continue on intervals, but when another findMatch request finds this database entry,
      // TODO: it will delete the entry and return the result and use socket to announce to the user's socketID where to join
      while (count <= 6) {
        const resp = await _findMatch(username, difficulty, roomsocketid);
        count += 1;
        console.log('resp is: ', resp);
        if (!resp) {
          console.log('Did not find match, count is ', count);
          const matchRequestExists = await _checkMatchRequestExists(username);
          if (!matchRequestExists) {
            console.log('Match request does not exist, creating new match request');
            // TODO: Decouple logic here
            try {
              const createMatchRequestResp = await _createMatchRequest(
                username,
                difficulty,
                roomsocketid
              );
            } catch (err) {
              console.log('Error creating match request', err);
              console.log('createMatchRequestResp', createMatchRequestResp);
            }
          }
          await sleep(4200);
          continue;
        }
        console.log('match found: ', resp.username);
        if (resp) {
          console.log(`Found match for user ${username} successfully!`);
          return res.status(201).json({
            mongodbID: resp._id,
            username: resp.username,
            createdAt: resp.createdAt,
            difficulty: resp.difficulty,
            roomSocketID: resp.socketID,
            message: `Completed match request for user ${username} successfully!`,
          });
        }

        if (resp.err) {
          return res.status(400).json({ message: 'Could not find match!' });
        }
      }
      console.log('Did not find match, while loop exits. Count is ', count);
      return res.status(400).json({
        message: 'Could not find match!',
      });
    } else {
      return res.status(400).json({ message: 'Username and/or Difficulty level are missing!' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Database failure when looking for match for user!' });
  }
}

export async function deleteMatchRequest(req, res) {
  try {
    const { username, difficulty } = req.body;
    const requestExists = await _checkMatchRequestExists(username);
    if (username) {
      if (!requestExists) {
        return res.status(400).json({ message: 'Could not find match request!' });
      }
      const resp = await _deleteMatchRequest(username, difficulty);
      console.log(resp);
      if (resp?.err) {
        return res.status(400).json({ message: 'Could not delete match request!' });
      }

      console.log(`Deleted match request for ${username} successfully!`);
      return res
        .status(201)
        .json({ message: `Deleted match request for ${username} successfully!` });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Database failure when deleting match request!' });
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
