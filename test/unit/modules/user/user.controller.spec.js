import chai from 'chai';
import sinon from 'sinon';

import {insert, removeOne, findSingle, findAll, update} from '../../../../services/mongodb/mongodb.service';
import {signup, signin} from '../../../../modules/user/user.controller';
import {connectMongo} from '../../../../config/mongo.config';
import {hashPassword, parseUser, setJwt} from '../../../../services/layers/user.layer';

const expect = chai.expect;

describe('signup', () => {
  afterEach((cb)=>{
    removeOne('users', {email: 'test@mail.com'}).then((done)=>{
      cb();
    })
  });
  it('should throw an error with 422 for incomplete data', () => {
    let req = {
      body: {
        email: 'test@mail.com'
      }
    };

    let res = {
      writeHead: (code, obj) => {

      },

      end: (msg) => {

      }
    }

    let spy1 = sinon.spy(res, 'writeHead');
    let spy2 = sinon.spy(res, 'end');

    signup(req, res).then((done) => {
      console.log(done);
      expect(spy1.withArgs(422, {'Content-Type': 'application/json'}).calledOnce).to.be.true;

      expect(spy2.withArgs(JSON.stringify({
        status: 422,
        message: 'Email or password not found.',
        error: 'hashPassword class requires email and password in the object.'
      })).calledOnce).to.be.true;
    });
  });

  it('should successfully create a user', () => {

    let req = {
      body: {
        email: 'test@mail.com',
        password: '1234afas'
      }
    };

    let res = {
      writeHead: (code, obj) => {

      },

      end: (msg) => {

      }
    };

    let spy1 = sinon.spy(res, 'writeHead');
    let spy2 = sinon.spy(res, 'end');

      signup(req, res).then((done) => {
        console.log(done);
        expect(spy1.withArgs(200, {'Content-Type': 'application/json'}).calledOnce).to.be.true;
      });

  })
});

describe('Signin', () => {

  before((cb)=>{

    insert('users', {email: 'signin@test.com', password: '14325'}, hashPassword, parseUser).then((done)=>{
      cb();
    }).catch((err)=>{
      console.log(err);
    })

  });

  after((cb)=>{
    removeOne('users', {email: 'signin@test.com'}).then((done)=>{
      cb()
    })
  });

  it('should return with  401 for invalid email/password', () => {
    let req = {
      body: {
        userEmail: 'signin@test.com',
        userPassword: '134'
      }
    };

    let res = {
      writeHead: (code, obj) => {

      },
      end: (msg) => {

      }
    };


    let spy1 = sinon.spy(res, 'writeHead');

    let spy2 = sinon.spy(res, 'end');

    signin(req, res).then((done) => {
      expect(done).to.be.true;
      expect(spy1.withArgs(401, {'Content-Type': 'application/json'}).calledOnce).to.be.true;
    })

  });

  it('should successfully create a jwt token', () => {
    let req = {
      body: {userEmail: 'signin@test.com', userPassword: '14325'}
    };

    let res = {
      writeHead: (code, obj) => {

      },
      end: (msg) => {

      }
    };

    let spy1 = sinon.spy(res, 'writeHead');
    let spy2 = sinon.spy(res, 'end');

    signin(req, res).then((done)=>{
      console.log('done is ', done);
      expect(spy1.withArgs(200, {'Content-Type': 'application/json'}));
    });

  });

});
