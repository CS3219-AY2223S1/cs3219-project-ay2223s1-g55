import { findUser, createUser } from "./repository.js";

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
  try {
    const newUser = await createUser({ username, password });
    newUser.save();
    return true;
  } catch (err) {
    console.log("ERROR: Could not create new user");
    return { err };
  }
}

export async function ormCheckUserExists(username) {
  try {
    const userFound = await findUser(username);
    return userFound != null;
  } catch (err) {
    console.log("ERROR: Error occured when finding users");
    return { err };
  }
}
