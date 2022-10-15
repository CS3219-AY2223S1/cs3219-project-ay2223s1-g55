import {
  listUserRecords,
  createRecord
} from './repository.js';

export async function ormCreateRecord(params) {
  try {
    const newRecord = await createRecord(params);
    newRecord.save();
    return newRecord;
  } catch (err) {
    console.error("Failed to create record");
    return { err }
  }
}

export async function ormListUserRecords(username, options) {
  try {
    const records = await listUserRecords(username, options);
    return records;
  } catch (err) {
    console.error("Failed to get records");
    return { err }
  }
}
