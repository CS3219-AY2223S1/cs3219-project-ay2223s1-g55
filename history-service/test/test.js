//During the test the env variable is set to test
import 'dotenv/config.js';
//Require the dev-dependencies
import chai, { assert, expect } from 'chai';
import chaiHttp from 'chai-http';
import recordModel from '../model/record-model.js';
import { createStubRecords, allDummyUsernames, findUserRecordsFromStubs } from './mock.js'
import { getUserRecords, getIndex, getUserCompletedQuestions, getUserExperience } from './server.js'
import { EXPERIENCE_POINTS } from '../lib/constants.js';
import { calculateUserExperienceLevel } from '../lib/helpers.js'

chai.use(chaiHttp);
chai.should();

const populateDatabaseBeforeHook = () => {
  const stubs = createStubRecords(20);
  before('populate database', async () => {
    await recordModel.insertMany(stubs)
    const documentsCount = await recordModel.countDocuments({})
    documentsCount.should.eq(stubs.length)
  })
  return stubs;
}

const clearDatabaseAfterHook = () => {
  after('clear database', async () => { await recordModel.deleteMany({}) });
}

describe('History-Service Basic Test', async () => {
  /**
   * Set-up
   */
  // Generate stubs, setup before hook to populate db, and return the stubs.
  const stubs = populateDatabaseBeforeHook(20);
  // Clear the test db after the test suite.
  clearDatabaseAfterHook();

  /*
   * Test the /GET route
   */
  it('Tests the endpoint', async () => { await getIndex() });

  /* 
   * Test the GET /records/:username route
   * Passes if correct number of records per user is returned
   */
  it('list user records', async () => {
    const tests = allDummyUsernames.map(async username => {
      const expectedRecordsCount = findUserRecordsFromStubs(stubs, username).length;

      const records = await getUserRecords(username);
      const actualRecordsCount = records.body.length;

      assert.equal(expectedRecordsCount, actualRecordsCount);
    })
    await Promise.all(tests);
  })

  /* 
   * Test the GET /completed/:username route
   * Passes if the completed questions are equal to the inserted ones.
   */
  it('list user completed questions', async () => {
    const tests = allDummyUsernames.map(async username => {
      const expectedCompletedQuestions = findUserRecordsFromStubs(stubs, username)
        .map(({ questionName }) => questionName) // Get all questions names

      const { body: actualCompletedQuestions } = await getUserCompletedQuestions(username)

      expect(expectedCompletedQuestions).to.include.members(actualCompletedQuestions);
    })
    await Promise.all(tests)
  })

  /* 
   * Test the GET /experience/:username route
   * Passes if the experience returned is the same as the calculated inserted experience
   */
  it('list user experience', async () => {
    const tests = allDummyUsernames.map(async username => {
      const expectedUserExperiencePoints = findUserRecordsFromStubs(stubs, username)
        .map(({ questionDifficulty }) => questionDifficulty)
        .reduce((sum, difficulty) => sum + EXPERIENCE_POINTS[`${difficulty}`], 0)
      const expectedUserExperienceLevel = calculateUserExperienceLevel(expectedUserExperiencePoints);

      const { body: { experiencePoints, experienceLevel } } = await getUserExperience(username)

      expect(experiencePoints).to.eq(expectedUserExperiencePoints);
      expect(experienceLevel).to.be.eq(expectedUserExperienceLevel)
    })
    await Promise.all(tests)
  })
});