import { ormCreateUser as _createUser, ormLoginUser as _loginUser } from '../model/user-orm.js'

export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const resp = await _createUser(username, password);
            console.log(resp);
            if (resp.err) {
                return res.status(400).json({message: 'Could not create a new user!'});
            } else {
                console.log(`Created new user ${username} successfully!`)
                return res.status(201).json({message: `Created new user ${username} successfully!`});
            }
        } else {
            return res.status(400).json({message: 'Username and/or Password are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new user!'})
    }
}

export async function loginUser(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(401).json({message: 'Username and/or Password are missing!'});
        }

        const resp = await _loginUser(username, password);

        if (!resp) {
            return res.status(401).json({ message: 'Username does not exist or invalid Password!'})
        }
        if (resp.err) {
            return res.status(401).json({message: 'Could not login user!'});
        } else {
            console.log(`User ${username} logged in successfully!`)
            return res.status(201).json({message: `User ${username} logged in successfully!`});
        }
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Database failure when logging in user!' })
    }
}
