//During the test the env variable is set to test
import 'dotenv/config.js';
//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';
import recordModel from '../model/record-model.js';

chai.use(chaiHttp);
chai.should();

describe('History-Service Basic Test', () => {
  beforeEach((done) => {
    recordModel.deleteOne({}, (err) => {
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
        .get('/api/history')
        .end((err, res) => {
          done();
        });
    });
  });
});