import { createUser, loginUser, logoutUser } from './repository.js';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
  try {
    const newUser = await createUser({ username, password });
    newUser.save();
    return true;
  } catch (err) {
    console.log('ERROR: Could not create new user');
    return { err };
  }
}

export async function ormLoginUser(username, password) {
  try {
    return await loginUser({ username, password });
  } catch (err) {
    console.log('ERROR: Could not login user');
    return { err };
  }
}

export async function ormLogoutUser(username) {
  try {
    return await logoutUser({ username });
  } catch (e) {
    console.log('ERROR: Could not log user out');
    return { e };
  }
}
