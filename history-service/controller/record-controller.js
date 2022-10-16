import {
  ormListUserRecords as _listUserRecords,
  ormCreateRecord as _createRecord,
  ormListUserCompletedQuestions as _listUserCompletedQuestions,
  ormGetUserExperienceLevel as _getUserExperienceLevel
} from '../model/record-orm.js';
import { validateRecord } from './validations.js';

export async function getUserExperienceLevel(req, res) {
  try {
    const { username } = req.params;

    const experience = await _getUserExperienceLevel(username);
    return res.status(200).json(experience);
  } catch (err) {
    return res.status(500).json({ message: 'Database failure when retrieving user completed questions.' });
  }
}

export async function listUserCompletedQuestions(req, res) {
  try {
    const { username } = req.params;

    const questions = await _listUserCompletedQuestions(username);
    return res.status(200).json(questions);
  } catch (err) {
    return res.status(500).json({ message: 'Database failure when retrieving user completed questions.' });
  }
}

export async function listUserRecords(req, res) {
  try {
    const { username } = req.params;
    const { offset, limit } = req.query;

    const records = await _listUserRecords(username, { limit, offset });
    return res.status(200).json(records);
  } catch (err) {
    return res.status(500).json({ message: 'Database failure when retrieving records.' });
  }
}

export async function createRecord(req, res) {
  try {
    const body = req.body;

    const { ok, err } = validateRecord(body);

    if (!ok) {
      return res.status(400).json({ message: "Invalid record values: " + err });
    }

    const resp = await _createRecord(body);

    if (resp.err) {
      return res.status(400).json({ message: 'Could not create a new record!' })
    }

    console.log("Created a new record successfully!")
    return res.status(200).json({ message: 'Created a new record successfully!' })
  } catch (err) {
    return res.status(500).json({ message: 'Database failure when creating new record.' })
  }
}
