import { createMatchSession, findMatchSession, findSessionById } from './respository.js';

export async function ormCreateMatchSession(
  difficulty,
  username1,
  user1RequestId,
  username2,
  user2RequestId,
  question
) {
  try {
    const newMatchSession = await createMatchSession({
      difficulty: difficulty,
      username1: username1,
      user1RequestId: user1RequestId,
      username2: username2,
      user2RequestId: user2RequestId,
      question,
    });
    newMatchSession.save();
    return newMatchSession;
  } catch (err) {
    console.log('ERROR: Could not create new match session');
    return { err };
  }
}

export async function ormFindMatchSession(username, difficulty, user1RequestId) {
  console.log('Running ormFindMatchSession');
  try {
    return await findMatchSession({
      username1: username,
      difficulty: difficulty,
      user1RequestId: user1RequestId,
    });
  } catch (err) {
    console.log('ERROR: Error occured when finding users:', err.body);
    return { err };
  }
}

export async function ormFindSessionById(sessionId) {
  try {
    return await findSessionById(sessionId);
  } catch (err) {
    console.log('ERROR: Error occured when retrieving question in session');
  }
}
