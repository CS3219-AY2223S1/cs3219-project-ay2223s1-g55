//During the test the env variable is set to test
import 'dotenv/config.js';
//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';
import userModel from '../model/user-model.js';

chai.use(chaiHttp);
chai.should();

describe('User-Service Basic Test', () => {
  beforeEach((done) => {
    userModel.deleteOne({}, (err) => {
      console.log(err);
      done();
    });
  });
  /*
   * Test the /GET route
   */
  describe('Test connection', () => {
    it('Test', (done) => {
      chai
        .request(app)
        .get('/api/user')
        .end((err, res) => {
          res.text.should.eq('Hello World from user-service?')
          done();
        });
    });
  });
});