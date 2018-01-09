import chai from 'chai';
import sinon from 'sinon';
import {addOnePost, updateOnePost} from '../../../../modules/post/post.controllers';
import {removeOne} from '../../../../services/mongodb/mongodb.service';

const expect = chai.expect;

describe('Add Product', ()=>{

  let postId;

  after((done)=>{
    removeOne('posts', {title: 'Test Product'}).then(data => done()).catch((err)=>{
      throw err
    });
  });

  it('should return with 422 for incomplete data', (done)=>{
    let req = {
      body: {
        title: 'Test Product',
        price: 22139,
        stock: 22
      }
    };

    let res = {
      writeHead: (code, obj)=>{
        return true
      },
      end: (msg)=>{
        return true
      }
    };

    let spy = sinon.spy(res, 'writeHead');

    addOneProduct(req, res).then((data)=>{
      expect(spy.withArgs(422, {'Content-Type': 'application/json'}).calledOnce).to.be.true;
      done()
    })

  });

  it('should successfully insert a product', (done)=>{
      let req = {
        body: {
          title: 'Test Product',
          price: 2212,
          stock: 20,
          description: 'This is a fine test product',
          gallery: ['image.png', 'test.png'],
          category: 'test'
        }
      };

    let res = {
      writeHead: (code, obj)=>{
        return true
      },
      end: (msg)=>{
        return true
      }
    };

    let spy = sinon.spy(res, 'writeHead');

    addOneProduct(req, res).then((data)=>{
      expect(spy.withArgs(200, {'Content-Type': 'application/json'}).calledOnce).to.be.true;
      expect(data).to.have.property('_id');
      productId = data._id;
      done()
    })

  });

  it('should return with 422 when updating with incomplete object', (done)=>{
    let req = {
      body:{
        title: 'Test Product',
        price: 2212,
        description: 'This is a fine test product',
        gallery: ['image.png', 'test.png'],
        category: 'test',
        _id: productId
      },
      params: {
        productId
      }
    };

    let res = {
      writeHead: (code, obj)=>{
        return true
      },
      end: (msg)=>{
        return true
      }
    };

    let spy = sinon.spy(res, 'writeHead');

    updateOneProduct(req, res).then((data)=>{
      expect(spy.withArgs(422, {'Content-Type': 'application/json'}).calledOnce).to.be.true;
      done()
    })
  });

  it('should successfully update a product', (done)=>{
    let req = {
      body:{
        title: 'Test Product',
        price: 2212,
        stock: 25,
        description: 'This is a fine test product',
        gallery: ['image.png', 'test.png'],
        category: 'test',
        _id: productId
      },
      params: {
        productId
      }
    };

    let res = {
      writeHead: (code, obj)=>{
        return true
      },
      end: (msg)=>{
        return true
      }
    };

    let spy = sinon.spy(res, 'writeHead');

    updateOneProduct(req, res).then((data)=>{
      expect(spy.withArgs(200, {'Content-Type': 'application/json'}).calledOnce).to.be.true;
      expect(data.stock).to.equal(25);
      done()
    })

  })
});