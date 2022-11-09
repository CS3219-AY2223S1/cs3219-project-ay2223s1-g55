import { faker } from '@faker-js/faker';

// Helpers
const range = (count) => [...Array(count).keys()]

// Constants
const dummyQuestions = [
  { questionName: 'Two Sum', questionDifficulty: 'Easy' },
  { questionName: 'Doubly-Linked List', questionDifficulty: 'Medium' },
  { questionName: 'Independent Set', questionDifficulty: 'Hard' },
]

// We split usernames into first and second to prevent situations where a user 'matches' with themselves.
const dummyFirstUsernames = range(5).map(index => 'firstUsernameTest' + index);
const dummySecondUsernames = range(5).map(index => 'secondUsernameTest' + index);
export const allDummyUsernames = [...dummyFirstUsernames, ...dummySecondUsernames]

// Mocker Functions
const getQuestionDetails = () => faker.helpers.arrayElement(dummyQuestions);
const getFirstDummyUsername = () => faker.helpers.arrayElement(dummyFirstUsernames);
const getSecondDummyUsername = () => faker.helpers.arrayElement(dummySecondUsernames);

// Stub Creation Functions
export const createStubRecord = () => {
  return {
    ...getQuestionDetails(),
    firstUsername: getFirstDummyUsername(),
    secondUsername: getSecondDummyUsername(),
    startedAt: faker.date.past(),
  }
}

export const createStubRecords = (count) => {
  return range(count).map(createStubRecord);
}

// Stub manipulation helpers
export const findUserRecordsFromStubs = (stubs, username) => {
  return stubs.filter((stub) => [stub.firstUsername, stub.secondUsername].includes(username))
}
