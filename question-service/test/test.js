// Import the dependencies for testing
import chai, { assert, expect } from 'chai';
import chaiHttp from 'chai-http';
import QuestionModel from '../model/question-model.js';
import app from '../index.js';
// Configure chai
chai.should();
chai.use(chaiHttp);

describe('Test DB', async () => {
  beforeEach(async () => {
    await QuestionModel.deleteMany({});
    console.log('done before each');
  });

  it('should create a new Question', async () => {
    const question = await new QuestionModel({
      title: 'Title',
      description: 'Description',
      difficulty: 'Easy',
      examples: [{ input: 'Test Input', output: 'Test Output' }],
      constraints: ['Test Constraint'],
    });
    await question.save();
    const record = await QuestionModel.findOne({ title: 'Title' });
    expect(record != null);
  });
});
