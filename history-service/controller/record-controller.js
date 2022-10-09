import {
  ormGetRecord as _getRecord,
  ormListUserRecords as _listUserRecords,
  ormCreateRecord as _createRecord,
} from '../model/record-orm.js';
import { isValidRecord } from './validations.js';

export async function getRecord(req, res) {
  try {
    const record = await _getRecord();
    return res.status(200).json(record);
  } catch (err) {
    return res.status(500).json({ message: 'Database failure when retrieving record. ' });
  }
}

export async function listUserRecords(req, res) {
  try {
    const { userId } = req.params;
    const { offset, limit } = req.query;

    const records = await _listUserRecords(userId, { limit, offset });
    return res.status(200).json(records);
  } catch (err) {
    return res.status(500).json({ message: 'Database failure when retrieving records.' });
  }
}

export async function createRecord(req, res) {
  try {
    const body = req.body;

    if (!isValidRecord(body)) {
      return res.status(400).json({ message: "Invalid record values." });
    }

    const resp = await _createRecord(body);

    if (resp.err) {
      return res.status(400).json({ message: 'Could not create a new uer!' })
    }

    return res.status(200).json({ message: 'Created a new record successfully!' })
  } catch (err) {
    return res.status(500).json({ message: 'Database failure when creating new record.' })
  }
}
