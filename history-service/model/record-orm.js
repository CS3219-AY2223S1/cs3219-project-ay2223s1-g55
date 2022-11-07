import {
  listUserRecords,
  createRecord,
  listUserCompletedQuestions,
  getUserExperienceLevel,
  countUserCompletedQuestions
} from './repository.js';

export async function ormGetUserExperienceLevel(username) {
  try {
    const experience = await getUserExperienceLevel(username);
    return experience;
  } catch (err) {
    console.error("Failed to get user experience level");
    return { err }
  }
}

export async function ormListUserCompletedQuestions(username) {
  try {
    const questions = await listUserCompletedQuestions(username);
    return questions;
  } catch (err) {
    console.error("Failed to get questions");
    return { err }
  }
}

export async function ormCountUserCompletedQuestions(username, groupBy) {
  try {
    const count = await countUserCompletedQuestions(username, groupBy);
    return count;
  } catch (err) {
    console.error("Failed to get questions");
    return { err }
  }
}

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
