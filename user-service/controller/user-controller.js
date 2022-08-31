import { ormCreateUser as _createUser } from '../model/user-orm.js'
import bcrypt from 'bcryptjs';

export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            // need to hash password before saving to db
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const resp = await _createUser(username, hashedPassword);
            console.log(resp);
            if (resp.err) {
                return res.status(400).json({ message: 'Could not create a new user!' });
            } else {
                console.log(`Created new user ${username} successfully!`)
                return res.status(201).json({ message: `Created new user ${username} successfully!` });
            }
        } else {
            return res.status(400).json({ message: 'Username and/or Password are missing!' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Database failure when creating new user!' })
    }
}
