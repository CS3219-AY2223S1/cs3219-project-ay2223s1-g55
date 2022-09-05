import {
  ormCheckUserExists as _checkUserExists,
  ormCreateUser as _createUser,
  ormLoginUser as _loginUser,
  ormLogoutUser as _logoutUser,
} from '../model/user-orm.js';
import jwt from 'jsonwebtoken';

export async function createUser(req, res) {
  try {
    const { username, password } = req.body;
    const usernameExists = await _checkUserExists(username);
    console.log(usernameExists);
    if (username && password) {
      if (usernameExists) {
        return res.status(409).json({ message: 'Username already in use!' });
      }
      const resp = await _createUser(username, password);
      // console.log(resp);
      if (resp.err) {
        return res.status(400).json({ message: 'Could not create a new user!' });
      } else {
        console.log(`Created new user ${username} successfully!`);
        return res.status(201).json({ message: `Created new user ${username} successfully!` });
      }
    } else {
      return res.status(400).json({ message: 'Username and/or Password are missing!' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Database failure when creating new user!' });
  }
}

export async function getSession(req, res) {
  try {
    if (!(req.headers?.authorization?.split(' ')[0] === 'Bearer')) {
      return res.status(401).send({ message: 'Bearer Token not found!' });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode.username) {
      res.status(401).send({ message: 'Invalid Bearer Token!' });
    }

    console.log(`User ${decode.username} logged in successfully!`);
    return res.status(200).send({
      message: `User session for ${decode.username} found!`,
      _id: decode._id,
      username: decode.username,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to retrieve session!' });
  }
}

export async function loginUser(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(401).json({ message: 'Username and/or Password are missing!' });
    }

    const resp = await _loginUser(username, password);
    if (!resp) {
      return res.status(401).json({ message: 'Username does not exist or invalid Password!' });
    }
    if (resp.err) {
      return res.status(401).json({ message: 'Could not login user!' });
    } else {
      const token = jwt.sign({ username: resp.username, _id: resp._id }, process.env.JWT_SECRET);

      console.log(`User ${username} logged in successfully!`);
      return res.status(200).json({
        message: `User ${username} logged in successfully!`,
        token,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Database failure when logging in user!' });
  }
}

export async function logoutUser(req, res) {
  try {
    const { token } = req.body;

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode.username) {
      console.log('Missing username!');
      return res.status(401).json({ message: 'Missing username!' });
    }

    const username = decode.username;

    const resp = await _logoutUser(username);

    if (!resp) {
      console.log('Log out unsuccessful!');
      return res.status(401).json({ message: 'Log out unsuccessful!' });
    }

    if (resp.e) {
      console.log('User does not exist in database!');
      return res.status(401).json({ message: 'User does not exist in database!' });
    } else {
      console.log(`User ${username} has been successfully logged out`);
      return res.status(200).json({
        message: `User ${username} has been successfully logged out!`,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Database failure when trying to log out!' });
  }
}
