import { createUser, loginUser } from './repository.js';
import bcrypt from 'bcryptjs';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
    try {
        const salt = await bcrypt.genSalt(10);
        console.log('password from params: ', password);
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
        return await loginUser({ username, password });
    } catch (err) {
        console.log("ERROR: Could not login user");
        return { err }
    }
}
