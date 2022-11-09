//During the test the env variable is set to test
import 'dotenv/config.js';
//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';
import editorModel from '../model/editor-model.js';

chai.use(chaiHttp);
chai.should();

describe('Editor-Service Basic Test', () => {
  beforeEach((done) => {
    editorModel.deleteOne({}, (err) => {
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
        .get('/api/collaboration')
        .end((err, res) => {
          done();
        });
    });
  });
});
