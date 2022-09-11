import MatchingModel from './matching-model.js';
import { createMatchRequest, findMatch } from './respository.js';
// need to separate orm functions from repository to decouple business logic from persistence
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
  try {
    // make sure is not the same user
    const matchFound = await findMatch({ username: username, difficulty: difficulty });
    return matchFound;
  } catch (err) {
    console.log('ERROR: Error occured when finding users');
    return { err };
  }
}
