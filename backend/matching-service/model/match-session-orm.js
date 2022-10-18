import { createMatchSession, findMatchSession } from './respository.js';

export async function ormCreateMatchSession(
  difficulty,
  username1,
  username1socketID,
  username2,
  username2socketID
) {
  try {
    const newMatchSession = await createMatchSession({
      difficulty: difficulty,
      username1: username1,
      username1socketID: username1socketID,
      username2: username2,
      username2socketID: username2socketID,
    });
    newMatchSession.save();
    return newMatchSession;
  } catch (err) {
    console.log('ERROR: Could not create new match session');
    return { err };
  }
}

export async function ormFindMatchSession(username, difficulty, username1socketID) {
  console.log('Running ormFindMatchSession');
  try {
    return await findMatchSession({
      username1: username,
      difficulty: difficulty,
      username1socketID: username1socketID,
    });
  } catch (err) {
    console.log('ERROR: Error occured when finding users:', err.body);
    return { err };
  }
}
