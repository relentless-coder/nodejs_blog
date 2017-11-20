import chai from 'chai';
import sinon from 'sinon';
import {authHandler} from '../../../handlers/auth.handler';

const expect = chai.expect;

describe('authHandler', ()=>{
  it('should return with next in case of signup', ()=>{

    let req = {
      url: '/api/v1/signup'
    };

    let res = {

    };

    let cb = sinon.spy();

    authHandler(req, res, cb);

    expect(cb.calledOnce).to.be.true;

  });

  it('should return with next in case of signin', ()=>{
    let req = {
      url: '/api/v1/signin'
    };

    let res = {

    };

    let cb = sinon.spy();

    authHandler(req, res, cb);

    expect(cb.calledOnce).to.be.true;
  });


});

