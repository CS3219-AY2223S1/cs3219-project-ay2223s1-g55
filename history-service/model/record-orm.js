import {
  getRecord,
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

export async function ormGetRecord() {
  try {
    const record = await getRecord();
    return record;
  } catch (err) {
    console.error("Failed to get record");
    return { err }
  }
}

export async function ormListUserRecords(userId, options) {
  try {
    const records = await listUserRecords(userId, options);
    return records;
  } catch (err) {
    console.error("Failed to get records");
    return { err }
  }
}
