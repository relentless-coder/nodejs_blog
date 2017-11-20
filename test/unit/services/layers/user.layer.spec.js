import crypto from 'crypto';

import chai from 'chai';

const expect = chai.expect;

import {setJwt, parseUser, hashPassword} from '../../../../services/layers/user.layer';
import {cryptoConfig} from '../../../../config/crypto.config';

describe('setJwt', ()=>{
  it('should throw with 422', ()=>{
    let data = {
      _id: undefined
    };
    expect(()=>{new setJwt(data)}).to.throw('_id not found').with.property('code', 422);
  });

  it('should generate a token', ()=>{

    let data = {
      _id: '123gasdd'
    };

    let salt = crypto.randomBytes(256).toString('base64');

    data.password = crypto.pbkdf2Sync('hello', salt, cryptoConfig.iterations, 32, 'sha512').toString('base64');
    data.salt = salt;
    data.userPassword = 'hello';

    let object = new setJwt(data);

    expect(object).to.be.a('object');
    expect(object.token).to.be.a('string');

  })
});

describe('parseUser', ()=>{
  it('should return an object, only with email and _id', ()=>{
    let data = {
      _id: 'absdj123',
      email: 'abd@mail.com',
      some: 123123
    };

    let object = new parseUser(data);

    expect(object).to.be.a('object');
    expect(Object.keys(object)).to.have.length(2);
  })
});

describe('hashPassword', ()=>{
  it('should throw error with 422 code', ()=>{
    let data = {
      email: 'some@mail.com'
    }

    expect(()=>{new hashPassword(data)}).to.throw('Email or password not found.').with.property('code', 422);

  });

  it('should return an object with only email, salt, and password', ()=>{
    let data = {
      email: 'some@mail.com',
      password: '1234asd'
    };

    let object = new hashPassword(data);

    expect(object).to.be.a('object');
    expect(Object.keys(object)).to.have.length(3);
    expect(object.email).to.be.a('string');
    expect(object.salt).to.be.a('string');
    expect(object.password).to.be.a('string');
  })
});