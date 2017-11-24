import chai from 'chai';
import moment from 'moment-timezone';
import {encode, generateExp} from '../../../../services/jwt/jwt.encode';

const expect = chai.expect;

describe('encode', ()=>{
  it('should throw error with 422 code when passed an empty object', ()=>{
    let payload = {

    };

    expect(()=>{encode(payload)}).to.throw('Can\'t process without complete data', 'You have passed an empty object as the payload to the encode function.').with.property('code', 422);

  });

  it('should return a token string when passed called with required data', ()=>{
    let payload = {
      _id: '123asdfhf'
    };

    let token = encode(payload);

    expect(token).to.be.a('string');
  })
});

describe('generateExp', ()=>{
  let ct = moment.tz('GMT').format('x');

  it('should generate correct exp according to 1d', ()=>{
    let data =  generateExp('1d');
    let expected = parseInt(ct) + (24*60*60*1000);
    expect(data).to.be.a('object');
    expect(data).to.have.property('iat');
    expect(data).to.have.property('exp');
    expect(Math.ceil(data.exp/1000)).to.be.within(Math.ceil(expected/1000) - 1, Math.ceil(expected/1000) + 1);
  })

});