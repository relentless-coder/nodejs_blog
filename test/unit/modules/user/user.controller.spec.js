import chai from 'chai';
import sinon from 'sinon';

import {insert, removeOne, findSingle, findAll, update} from '../../../../services/mongodb/mongodb.service';
import {signup, signin} from '../../../../modules/user/user.controller';
import {connectMongo} from '../../../../config/mongo.config';
import {hashPassword, parseUser, setJwt} from '../../../../services/layers/user.layer';

const expect = chai.expect;

describe('signup', () => {

  before((done)=>{
    insert('users', {email: 'ayush@test.com', password: '12daur3'}, hashPassword, parseUser).then((data)=>{
      done();
    })
  });

  after((cb)=>{
    removeOne('users', {email: 'test@mail.com'}).then((done)=>{
      cb();
    })
  });

  after((done)=>{
    removeOne('users', {email: 'ayush@test.com'}).then((data)=>{
      done()
    })
  });

  it('should throw an error with 422 for incomplete data', (done) => {
    let req = {
      body: {
        email: 'random@mail.com'
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

    signup(req, res).then((data)=>{
      expect(spy1.withArgs(422, {'Content-Type': 'application/json'}).calledOnce).to.be.true;
      done()
    })
  });

  it('should return with 422 when the email already exists', (done)=>{
    let req = {
      body: {
        email: 'ayush@test.com',
        password: '12sdah'
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

    signup(req, res).then((data)=>{
      expect(spy1.withArgs(422, {'Content-Type': 'application/json'}).calledOnce).to.be.true;
      done()
    })
  });

  it('should successfully create a user', (done) => {

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

      signup(req, res).then((data) => {
        expect(spy1.withArgs(200, {'Content-Type': 'application/json'}).calledOnce).to.be.true;
        done();
      });

  })
});

describe('Signin', () => {

  before((cb)=>{

    insert('users', {email: 'signin@test.com', password: '14325'}, hashPassword, parseUser).then((done)=>{
      cb();
    }).catch(err => err);

  });

  after((cb)=>{
    removeOne('users', {email: 'signin@test.com'}).then((done)=>{
      cb()
    }).catch(err => err)
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
      expect(spy1.withArgs(401, {'Content-Type': 'application/json'}).calledOnce).to.be.true;
    })

  });

  it('should successfully create a jwt token', (done) => {
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

    signin(req, res).then((data)=>{
      expect(spy1.withArgs(200, {'Content-Type': 'application/json'}));
      done();
    });

  });

});
