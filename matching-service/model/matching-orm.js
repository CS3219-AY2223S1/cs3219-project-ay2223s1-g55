import MatchingModel from './matching-model.js';
import {
  createMatchRequest,
  deleteMatchRequest,
  findMatch,
  findMatchRequest,
} from './respository.js';
// need to separate orm functions from repository to decouple business logic from persistence
// const ormPendingFindMatch = setTimeout(() => ormFindMatch(username, difficulty), 10000, 2000);

export async function ormCreateMatchRequest(username, difficulty) {
  try {
    const newMatchRequest = await createMatchRequest({
      username: username,
      difficulty: difficulty,
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
    // setTimeout will return while running in the background
    // sleep will run it and stop all other operations
    // await sleep(50000);
    // setTimeout(() => ormFindMatch(username, difficulty), 1000);
    // }
  } catch (err) {
    console.log('ERROR: Error occured when finding users:', err.body);
    return { err };
  }
}

export async function ormCheckMatchRequestExists(username) {
  try {
    const userFound = await findMatchRequest(username);
    return userFound != null;
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

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
