import chai from 'chai';
import {getProduct} from "../../../../../services/layers/product.layer";
import {addProduct} from "../../../../../services/layers/product.layer";

const should = chai.should();


describe('Get Product', ()=>{
    it('shouldn\'t populate values that are not defined', ()=>{
        let data = {
            _id: '162738123hasdhasd',
            title: 'Product 1',
            price: 2234,
            category: 'clothing',
            description: 'This is a fine product 1',
            gallery: ['image1.png', 'image2.png'],
            stock: 100,
            tax: 20
        };

        let result = new getProduct(data);

        result.should.not.have.property('tax');
    });
});

describe('Add Product', ()=>{
   it('shouldn\'t store values that are not defined', ()=>{
       let data = {
           _id: '162738123hasdhasd',
           title: 'Product 1',
           price: 2234,
           category: 'clothing',
           description: 'This is a fine product 1',
           gallery: ['image1.png', 'image2.png'],
           stock: 100,
           tax: 20
       };

       let result = new addProduct(data);

       result.should.not.have.property('tax');
       result.should.not.have.property('_id');

   })
});