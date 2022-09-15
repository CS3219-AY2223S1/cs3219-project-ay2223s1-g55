import MatchingModel from './matching-model.js';
import {
  createMatchRequest,
  deleteMatchRequest,
  findMatch,
  findMatchRequest,
} from './respository.js';
// need to separate orm functions from repository to decouple business logic from persistence

export async function ormCreateMatchRequest(username, difficulty, socketID) {
  try {
    const newMatchRequest = await createMatchRequest({
      username: username,
      difficulty: difficulty,
      socketID: socketID,
    });
    newMatchRequest.save();
    return true;
  } catch (err) {
    console.log('ERROR: Could not create new user');
    return { err };
  }
}

export async function ormFindMatch(username, difficulty) {
  console.log('Running ormFindMatch');
  try {
    return await findMatch({ username: username, difficulty: difficulty });
  } catch (err) {
    console.log('ERROR: Error occured when finding users:', err.body);
    return { err };
  }
}

export async function ormCheckMatchRequestExists(username) {
  try {
    const matchFound = await findMatchRequest(username);
    return matchFound != null;
  } catch (err) {
    console.log('ERROR: Error occured when finding users');
    return { err };
  }
}

export async function ormDeleteMatchRequest(username, difficulty) {
  try {
    await deleteMatchRequest({ username: username });
    return true;
  } catch (err) {
    console.log('ERROR: Error occured when deleting user');
    return { err };
  }
}

// Javascript recommendation for sleep function
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
