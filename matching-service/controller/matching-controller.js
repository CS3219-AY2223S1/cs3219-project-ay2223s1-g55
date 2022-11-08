import {
  ormCreateMatchRequest as _createMatchRequest,
  ormFindMatchRequest as _findMatchRequest,
  ormDeleteMatchRequest as _deleteMatchRequest,
  ormCheckMatchRequestExists as _checkMatchRequestExists,
  ormUpdateMatchRequest as _updateMatchRequest,
  ormCheckMatchRequestIsMatched as _checkMatchRequestIsMatched,
  ormCancelMatchRequest as _cancelMatchRequest,
} from '../model/matching-orm.js';

import {
  ormCreateMatchSession as _createMatchSession,
  ormFindMatchSession as _findMatchSession,
  ormFindSessionById as _findSessionById,
} from '../model/match-session-orm.js';
import { sleep } from '../utils/sleep.js';
import { URL_QUESTION_SVC } from '../utils/configs.js';
import axios from 'axios';

export async function createMatchRequest(req, res) {
  try {
    const { username, difficulty, requestId } = req.body;
    if (username && difficulty && requestId) {
      const resp = await _createMatchRequest(username, difficulty, requestId);
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
      return res
        .status(400)
        .json({ message: 'Username and/or Password and/or SocketID are missing!' });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: 'Database failure when creating new match request for user!' });
  }
}

// Need to find match for 30s at least
export async function findMatchRequest(req, res) {
  let count = 0;
  let matchFound = false;
  let username1;
  let user1RequestId;
  let username2;
  let user2RequestId;
  let matchRoomId;
  let message;
  let question;
  console.log(`Running findMatchRequest for ${count} time`);
  console.log('req.body for findMatch is', req.body);
  try {
    const { username, difficulty, requestId } = req.body;

    if (!username || !difficulty || !requestId) {
      console.log(username, difficulty, requestId);
      return res
        .status(400)
        .json({ message: 'Username and/or Difficulty and/or SocketID are missing!' });
    }

    // Runs search for match for intervaals of 2s for 14 times
    while (count <= 14 && !matchFound) {
      const resp = await _findMatchRequest(username, difficulty);
      console.log('resp is', resp);

      count += 1;
      console.log('resp is: ', resp);
      // Match not found, resp is false
      if (!resp) {
        const matchRequestExists = await _checkMatchRequestExists(username, difficulty);
        // Run a check if the request isCancelled
        if (matchRequestExists.isCancelled) {
          console.log('Match request is cancelled');
          await _deleteMatchRequest(difficulty, false, username);
          return res.status(400).json({ message: 'Match request is cancelled' });
        }
        if (!matchRequestExists) {
          console.log('Match request does not exist, creating new match request');
          // TODO: Decouple logic here
          try {
            await _createMatchRequest(username, difficulty, requestId);
          } catch (err) {
            console.log('Error creating match request', err);
          }
        } else {
          // match Request exist
          const isMatched = await _checkMatchRequestIsMatched(username, difficulty);
          if (isMatched) {
            console.log('Match request is matched, deleting match request');
            try {
              await _deleteMatchRequest(difficulty, true, username);
              const matchSession = await _findMatchSession(username, difficulty, requestId);
              message = `Found match between ${matchSession.username1} and ${matchSession.username2} successfully!`;
              username1 = matchSession.username1;
              user1RequestId = matchSession.user1RequestId;
              username2 = matchSession.username2;
              user2RequestId = matchSession.user2RequestId;
              matchRoomId = matchSession._id;
              matchFound = true;
              console.log('isMatched is true, match found : ', message);
              break;
            } catch (err) {
              console.log('Error deleting match request', err);
            }
          }
        }
        await sleep(2000);
        continue;
      }

      if (resp) {
        console.log(`match found for user ${username} successfully!: `, resp);
        const updatedMatchRequest = await _updateMatchRequest(
          difficulty,
          resp.isMatched,
          resp.username1,
          resp.user1RequestId,
          username,
          requestId
        );
        console.log('updatedMatchRequest', updatedMatchRequest);

        if (updatedMatchRequest) {
          console.log('Updated match request successfully');
          // TODO: Figure out algorithm for selecting question, and also according to difficulty.
          const axiosResp = await axios.get(
            `${URL_QUESTION_SVC}?difficulty=${difficulty.toLowerCase()}`
          );
          const qns = axiosResp.data.questions;
          const numQn = qns.length;
          const randomIndex = Math.floor(Math.random() * numQn);
          question = qns[randomIndex].title;
          const matchSession = await _createMatchSession(
            updatedMatchRequest.difficulty,
            updatedMatchRequest.username1,
            updatedMatchRequest.user1RequestId,
            updatedMatchRequest.username2,
            updatedMatchRequest.user2RequestId,
            question
          );
          console.log('Created match session successfully:', matchSession);
          if (matchSession) {
            // return res.status(200).json({
            message = `Found match between ${matchSession.username1} and ${matchSession.username2} successfully!`;
            username1 = matchSession.username1;
            user1RequestId = matchSession.user1RequestId;
            username2 = matchSession.username2;
            user2RequestId = matchSession.user2RequestId;
            matchRoomId = matchSession._id;
            matchFound = true;
            question = matchSession.question;
            // });
          }
        }
        // Break out of while loop
        break;
      }

      if (resp.err) {
        return res.status(400).json({ message: 'Could not find match!' });
      }
    }
    console.log('Find match, while loop exits. Count is ', count);
    await _deleteMatchRequest(difficulty, false, username);
    // console.log('break out of while loop res: ', res);
    if (!matchFound) {
      return res.status(400).json({
        message: 'Could not find match!',
      });
    }
    return res.status(200).json({
      message,
      username1,
      user1RequestId,
      username2,
      user2RequestId,
      matchRoomId,
      question,
    });
  } catch (err) {
    // }
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

export async function cancelMatchRequest(req, res) {
  try {
    const { username, difficulty } = req.body;
    const requestExists = await _checkMatchRequestExists(username);
    if (username) {
      if (!requestExists) {
        return res.status(400).json({ message: 'Could not find match request!' });
      }
      // ! Should not need to pass in boolean value, request itself should be self explanatory?
      const resp = await _cancelMatchRequest(difficulty, username);
      console.log(resp);
      if (resp?.err) {
        return res.status(400).json({ message: 'Could not cancel match request!' });
      }

      console.log(`Cancelled match request for ${username} successfully!`);
      return res
        .status(201)
        .json({ message: `Cancelled match request for ${username} successfully!` });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Database failure when cancelling match request!' });
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

export const getMatchSession = async (req, res) => {
  const sessionId = req.params.sessionId;
  if (!sessionId) return res.status(400).send({ message: 'Session id not found' });

  const resp = await _findSessionById(sessionId);
  if (!resp) return res.status(400).send({ message: 'Failed to retrieve session' });

  return res.status(200).json({ data: resp });
};
