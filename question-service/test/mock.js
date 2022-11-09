import { faker } from '@faker-js/faker';

// Helpers
const range = (count) => [...Array(count).keys()];

// Constants
const difficulties = ['Easy', 'Medium', 'Hard'];

const createRandomQuestion = () => {
  return {
    title: faker.name.fullName(),
    description: faker.datatype.string(),
    difficulty: faker.helpers.arrayElement(difficulties),
  };
};

export const randQuestion = createRandomQuestion();
export const randQuestions = (number) => range(number).map(createRandomQuestion);
export const findQuestion = (stubs, title) => stubs.filter((stub) => stub.title === title);

const createRandomComment = () => {
  return {
    user: faker.word.adjective(),
    comment: faker.datatype.string(),
  };
};

export const randComment = createRandomComment();
