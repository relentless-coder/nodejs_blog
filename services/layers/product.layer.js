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
    console.log(title, description, category, price, gallery, stock)
    this.title = title;
    this.description = description;
    this.category = category;
    this.price = Number(price);
    this.stock = Number(stock);
    this.gallery = gallery;
  }
}

export class updateProduct {
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