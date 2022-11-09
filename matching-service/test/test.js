//During the test the env variable is set to test
import 'dotenv/config.js';
//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';
import matchingModel from '../model/matching-model.js';

chai.use(chaiHttp);
chai.should();

describe('Communication-Service Basic Test', () => {
  beforeEach((done) => {
    matchingModel.deleteOne({}, (err) => {
      console.log(err);
      done();
    });
  });
  /*
   * Test the /GET route
   */
  describe('GET /api/communication', () => {
    it('Should return 200', (done) => {
      chai
        .request(app)
        .get('/api/match')
        .end((err, res) => {
          done();
        });
    });
  });
});
