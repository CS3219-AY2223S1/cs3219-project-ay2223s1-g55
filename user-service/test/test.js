//During the test the env variable is set to test
import 'dotenv/config.js';
//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';
import userModel from '../model/user-model.js';
import { ormCreateUser } from '../model/user-orm.js';

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
          done();
        });
    });
  });
  /*
   * Test the /login /signup route
   */
  describe('/GET/:id ', () => {
    it('it should successfully sign up someone', (done) => {
      const req = {
        username: 'tester99',
        password: 'P@ssword1',
      };
      chai
        .request(app)
        .post('/api/user')
        .send(req)
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
    it('it should successfully login someone', (done) => {
      const req = {
        username: 'tester999',
        password: 'P@ssword1',
      };
      ormCreateUser(req.username, req.password).then((res) => {
        chai
          .request(app)
          .post('/api/user/login')
          .send(req)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });
    it('it should successfully sign up then login someone', (done) => {
      const req = {
        username: 'tester9999',
        password: 'P@ssword1',
      };
      chai
        .request(app)
        .post('/api/user')
        .send(req)
        .end((err, res) => {
          res.should.have.status(201);
          chai
            .request(app)
            .post('/api/user/login')
            .send(req)
            .end((err, res) => {
              res.should.have.status(200);
              done();
            });
        });
    });
  });
});
