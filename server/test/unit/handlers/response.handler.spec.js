import chai from 'chai';
import sinon from 'sinon';
import {responseHandler} from '../../../handlers/response.handler';

const expect = chai.expect;

describe('responseHandler', ()=>{
  it('should throw error if not called with atleast 4 arguments', ()=>{
    expect(()=>{responseHandler('hello', 'sdjasd', 'saddy')}).to.throw('You need to pass atleast 4 arguments');
  })

  it('should throw error if the first argument isn\'t an object with writeHead, and end method', ()=>{
    expect(()=>{responseHandler({call: ()=>{console.log(done)}}, 'hello', 'sdjasd', 'saddy')}).to.throw('The first argument must be an object with methods writeHead and end');
  })

  it('should call the writeHead and end method for success', ()=>{
    let res = {
      writeHead: (code, obj)=>{

      },
      end: (msg)=>{

      }
    };

    let data = {
      res,
      status: 200,
      message: 'Booking confirmed',
      data: {msg: 'Hello'}
    }

    let spy1 = sinon.spy(res, 'writeHead');
    let spy2 = sinon.spy(res, 'end');

    responseHandler(data.res, data.status, data.message, data.data);

    expect(spy1.withArgs(data.status, {'Content-Type': 'application/json'}).calledOnce).to.be.true;
    expect(spy2.withArgs(JSON.stringify({status: data.status, message: data.message, data: data.data})).calledOnce).to.be.true;

  })

  it('should call the writeHead and end for error', ()=>{
    let res = {
      writeHead: (code, obj)=>{

      },
      end: (msg)=>{

      }
    };

    let data = {
      res,
      status: 500,
      message: 'Booking confirmed',
      error: {msg: 'Hello'}
    };

    let spy1 = sinon.spy(res, 'writeHead');
    let spy2 = sinon.spy(res, 'end');

    responseHandler(data.res, data.status, data.message, data.error, true);

    expect(spy1.withArgs(data.status, {'Content-Type': 'application/json'}).calledOnce).to.be.true;
    expect(spy2.withArgs(JSON.stringify({status: data.status, message: data.message, error: data.error})).calledOnce).to.be.true;
  })
});