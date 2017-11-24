import {ErrorWithStatusCode} from '../../handlers/errorhandler';

export class getProduct {
  constructor({_id, title, description, category, price, gallery, stock}) {
    this._id = _id;
    this.title = title;
    this.description = description;
    this.category = category;
    this.price = Number(price);
    this.stock = Number(stock);
    this.gallery = gallery;
  }
}

export class addProduct {
  constructor({title, description, category, price, gallery, stock}) {
    if(!title || !description || !category || !price || !gallery || !stock){
      throw new ErrorWithStatusCode(422, 'Sorry, can\'t process request without complete data.', 'The data received from the client is incomplete. Required are title, description, category, price, gallery, stock.')
    } else {
      this.title = title;
      this.description = description;
      this.category = category;
      this.price = Number(price);
      this.stock = Number(stock);
      this.gallery = gallery;
    }
  }
}

export class updateProduct {
  constructor({_id, title, description, category, price, gallery, stock}) {
    if(!_id || !title || !description || !category || !price || !gallery || !stock){
      throw new ErrorWithStatusCode(422, 'Can\'t update document with empty object', 'Send the object with all the properties, as the missing keys would replace the original keys with null values.')
    } else {
      this._id = _id;
      this.title = title;
      this.description = description;
      this.category = category;
      this.price = Number(price);
      this.stock = Number(stock);
      this.gallery = gallery;
    }
  }
}