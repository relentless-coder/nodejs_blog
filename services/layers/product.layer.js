export class getProduct{
    constructor({_id, title, description, category, price, gallery}){
        this._id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.price = price;
        this.gallery = gallery;
    }
}

export class addProduct{
    constructor({title, description, category, price, gallery}){
        this.title = title;
        this.description = description;
        this.category = category;
        this.price = price;
        this.gallery = gallery;
    }
}

export class updateProduct{
    constructor({_id, title, description, category, price, gallery}){
        this._id = _id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.price = price;
        this.gallery = gallery;
    }
}