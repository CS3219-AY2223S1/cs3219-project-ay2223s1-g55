import {
  createMatchRequest,
  updateMatchRequest,
  deleteMatchRequest,
  checkMatchRequestExists,
  findMatchRequest,
  checkMatchRequestIsMatched,
  cancelMatchRequest,
} from './respository.js';
// need to separate orm functions from repository to decouple business logic from persistence

export async function ormCreateMatchRequest(username, difficulty, requestId) {
  try {
    const newMatchRequest = await createMatchRequest({
      difficulty: difficulty,
      isMatched: false,
      username1: username,
      user1RequestId: requestId,
    });
    newMatchRequest.save();
    return true;
  } catch (err) {
    console.log('ERROR: Could not create new user');
    return { err };
  }
}

export async function ormFindMatchRequest(username, difficulty) {
  console.log('Running ormFindMatchRequest');
  try {
    return await findMatchRequest({ username2: username, difficulty: difficulty });
  } catch (err) {
    console.log('ERROR: Error occured when finding users:', err.body);
    return { err };
  }
}

export async function ormCheckMatchRequestExists(username) {
  try {
    const matchFound = checkMatchRequestExists({
      username: username,
    });
    console.log('matchFound:', matchFound);
    return matchFound;
  } catch (err) {
    console.log('ERROR: Error occured when finding users');
    return { err };
  }
}

export async function ormDeleteMatchRequest(difficulty, isMatched, username) {
  try {
    await deleteMatchRequest({ difficulty: difficulty, isMatched: isMatched, username: username });
    return true;
  } catch (err) {
    console.log('ERROR: Error occured when deleting user', err);
    return { err };
  }
}

export async function ormCancelMatchRequest(difficulty, username) {
  try {
    const cancelledMatchRequest = await cancelMatchRequest({
      difficulty: difficulty,
      username: username,
    });
    if (cancelledMatchRequest == null) {
      console.log('Match request does not exist');
      return false;
    }
    return cancelledMatchRequest;
    // return true;
  } catch (err) {
    console.log('ERROR: Error occured when cancelling match request', err);
    return { err };
  }
}

export async function ormUpdateMatchRequest(
  difficulty,
  isMatched,
  username1,
  user1RequestId,
  username2,
  user2RequestId
) {
  try {
    const updatedMatchRequest = await updateMatchRequest({
      difficulty: difficulty,
      isMatched: isMatched,
      username1: username1,
      user1RequestId: user1RequestId,
      username2: username2,
      user2RequestId: user2RequestId,
    });
    console.log('Updated match request successfully');
    if (updatedMatchRequest == null) {
      console.log('Match request does not exist');
      return false;
    }
    return updatedMatchRequest;
  } catch (err) {
    console.log('ERROR: Error occured when updating user :', err);
    return { err };
  }
}

export async function ormCheckMatchRequestIsMatched(username, difficulty) {
  try {
    const matchFound = checkMatchRequestIsMatched({
      username1: username,
      difficulty: difficulty,
    });
    console.log('matchFound:', matchFound);
    return matchFound;
  } catch (err) {
    console.log('ERROR: Error occured when finding users');
    return { err };
  }
}
