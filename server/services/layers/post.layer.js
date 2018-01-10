import {ErrorWithStatusCode} from '../../handlers/errorhandler';

export class getPost {
  constructor({_id, title, description, category, meta, gallery, content, comments}) {
    this._id = _id;
    this.title = title;
    this.description = description;
    this.category = category;
    this.meta = meta;
    this.content = content;
    this.comments = comments;
  }
}

export class addPost {
  constructor({title, description, category, meta, gallery, content}) {
    if(!title || !description || !category || !meta || !content){
      throw new ErrorWithStatusCode(422, 'Sorry, can\'t process request without complete data.', 'The data received from the client is incomplete. Required are title, description, category, price, gallery, stock.')
    } else {
      this.title = title;
      this.description = description;
      this.category = category;
      this.meta = meta
      this.content = content;
    }
  }
}

export class updateProduct {
  constructor({_id, title, description, category, meta, content, comments}) {
    if(!_id || !title || !description || !category || !meta || !content){
      throw new ErrorWithStatusCode(422, 'Can\'t update document with empty object', 'Send the object with all the properties, as the missing keys would replace the original keys with null values.')
    } else {
      this._id = _id;
      this.title = title;
      this.description = description;
      this.category = category;
      this.meta = meta;
      this.content = content;
      this.comments = comments;
    }
  }
}