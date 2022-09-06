import UserModel from './user-model.js';
import { createUser, findUser, loginUser, logoutUser, deleteUser } from './repository.js';
import bcrypt from 'bcryptjs';

// need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await createUser({ username: username, password: hashedPassword });
        newUser.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new user');
        return { err };
    }
}

export async function ormLoginUser(username, password) {
    try {
        const user = await UserModel.findOne({ username });
        const correctPassword = await bcrypt.compare(password, user.password);
        if (user && correctPassword) {
            return await loginUser({ username });
        }
    } catch (err) {
        console.log("ERROR: Could not login user");
        return { err }
    }
}

export async function ormLogoutUser(username) {
  try {
    return await logoutUser({ username });
  } catch (err) {
    console.log('ERROR: Could not log user out');
    return { err };
  }
}

export async function ormCheckUserExists(username) {
  try {
    const userFound = await findUser(username);
    return userFound != null;
  } catch (err) {
    console.log('ERROR: Error occured when finding users');
    return { err };
  }
}

export async function ormDeleteUser(username) {
    try {
        return await deleteUser({ username });
    } catch (err) {
        console.log("ERROR: Could not delete user");
        return { err };
    }
}
