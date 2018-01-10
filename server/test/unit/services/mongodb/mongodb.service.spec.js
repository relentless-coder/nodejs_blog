import chai from 'chai';
import sinon from 'sinon';
import {findSingle, findAll, update, insert} from "../../../../services/mongodb/mongodb.service";
import {addProduct} from "../../../../server/services/layers/product.layer";
import {getProduct} from "../../../../server/services/layers/product.layer";
import {ErrorWithStatusCode} from "../../../../handlers/errorhandler";

const expect = chai.expect;

describe('Mongodb insert', () => {
  it('should return 422 when called with empty document', () => {
    let doc = {};

    let collection = {
      insertOne: (doc) => {
        doc._id = '123absd';
        return Promise.resolve({
          ops: doc
        })
      }
    };

    let dummy = {
      collection: (collection) => {
        return collection
      },
      close: () => {
        return true;
      }
    };

    let spy = sinon.spy(collection, 'insertOne');
    expect(()=>{
      insert(collection, doc, addProduct, getProduct, dummy)
    }).to.throw().with.property('code', 400);
  });


  it('should call the right methods on insert and insert a document', (done)=>{
    let doc = {
      title: 'Product 1',
      price: 2231,
      stock: 20,
      tax: 18,
      description: 'This is a fine first product, for sure',
      gallery: ['image1.png', 'image2.png'],
      category: 'clothing'
    };

    let cb = (err, data)=>{
      return {ops: data}
    };

    let collection = {
      insertOne: (doc, cb)=>{
        doc._id = '123absd';
        let data = {ops: [doc]};
        return Promise.resolve(cb(null, data))
      }
    };

    let dummy = {
      collection: (collection)=>{
        return collection
      },
      close: ()=>{
        return true;
      }
    };

    let spy1 = sinon.spy(dummy, 'collection');
    let spy2 = sinon.spy(dummy, 'close');
    let spy3 = sinon.spy(collection, 'insertOne');

    insert(collection, doc, addProduct, getProduct, dummy).then((data)=>{
      expect(spy1.calledOnce).to.be.true;
      expect(spy2.calledOnce).to.be.true;
      expect(spy3.calledOnce).to.be.true;
      data.should.be.a('object');
      data.should.not.have.property('error');
      data['status'].should.equal(200);
      data['data'].should.have.property('_id');
      data['data'].should.not.have.property('tax');
      done()
    });

  })
});

