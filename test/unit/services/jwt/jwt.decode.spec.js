import chai from 'chai';
import {decode} from '../../../../services/jwt/jwt.decode';
import {encode} from '../../../../services/jwt/jwt.encode';

const expect = chai.expect;

describe('decode', ()=>{
  it('should throw error with 401 for no authorization header', ()=>{
    let req = {
      headers: {

      }
    };

    expect(()=>{decode(req)}).to.throw('Unauthorized Error').with.property('code', 401);
  });

  it('should throw error with 401 for invalid token format', ()=>{
    let req = {
      headers: {
        authorization: 'Bearer ahsdsd.1232=='
      }
    };

    expect(()=>{decode(req)}).to.throw('Invalid token format').with.property('code', 401);

  });

  it('should throw error with 401 if the signature doesn\'t match', ()=>{
    let req = {
      headers: {
        authorization: 'Bearer ahsdsd.1232==.asdhh1233faj'
      }
    };

    expect(()=>{decode(req)}).to.throw('Invalid token').with.property('code', 401);

  });

  it('should return the decoded token that matches the _id', ()=>{
    let data = {
      _id: 'a2f13f'
    };

    let token = encode(data);

    let req = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };

    let object = decode(req);

    expect(object).to.be.a('object');
    expect(object).to.have.property('_id');
    expect(object._id).to.equal('a2f13f')

  })
});