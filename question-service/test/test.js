// Import the dependencies for testing
import chai, { assert, expect } from 'chai';
import chaiHttp from 'chai-http';
import QuestionModel from '../model/question-model.js';
import app from '../index.js';
import { randComment, randQuestion, randQuestions } from './mock.js';
// Configure chai
chai.should();
chai.use(chaiHttp);

// Helpers
const populateDb = async () => {
  const questions = randQuestions(200);
  await QuestionModel.insertMany(questions, { ordered: false });
};

const clearDb = async () => {
  await QuestionModel.deleteMany({});
};

const BASE_URL = '/api/question';

// Tests
describe('Test DB', async () => {
  before(async () => {
    await clearDb();
  });

  it('should create a new Question', async () => {
    const question = await new QuestionModel({
      title: 'Title',
      description: 'Description',
      difficulty: 'Easy',
    });
    await question.save();
    const record = await QuestionModel.findOne({ title: 'Title' });
    expect(record != null);
    expect(record.title === 'Title');
  });

  describe('Test API Endpoints', async () => {
    beforeEach(async () => {
      await populateDb();
    });

    afterEach(async () => {
      await clearDb();
    });

    // GET /question
    it('list all questions', async () => {
      const questions = await QuestionModel.find({});
      const actualCount = questions.length;

      const res = await chai.request(app).get(`${BASE_URL}/question`).send();
      expect(res.status).to.be.equal(200);
      expect(res.body).to.have.property('questions');
      expect(res.body.questions).to.have.lengthOf(actualCount);
    });

    // GET /question/:title
    it('list a specific question given a title', async () => {
      const sampleQuestion = randQuestion;
      const question = await new QuestionModel(sampleQuestion);
      await question.save();
      const slugifiedTitle = randQuestion.title.replace(/ /g, '-').toLowerCase();
      console.log('slugified title', slugifiedTitle);
      const res = await chai.request(app).get(`${BASE_URL}/question/${slugifiedTitle}`).send();
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('question');
      expect(res.body.question).to.be.a('Array');
      expect(res.body.question).to.have.lengthOf(1);
    });

    // POST /question
    it('add a question', async () => {
      const sampleQuestion = randQuestion;
      const res = await chai.request(app).post(`${BASE_URL}/question`).send(sampleQuestion);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', `'${sampleQuestion.title}' successfully added`);
    });

    // POST /question/:title
    it('add a comment to a question given a title', async () => {
      const comment = randComment;
      const sampleQuestion = randQuestion;
      const slugifiedTitle = randQuestion.title.replace(/ /g, '-').toLowerCase();

      const question = await new QuestionModel(sampleQuestion);
      await question.save();
      const res = await chai
        .request(app)
        .post(`${BASE_URL}/question/${slugifiedTitle}`)
        .send(comment);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Comment successfully added');
    });

    after(async () => {
      await clearDb();
    });
  });
});
