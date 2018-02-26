export class SaveSubscriber{
    constructor({email, name}){
        this.name = name;
        this.email = email;
    }
}

export class ParseSubscriber{
    constructor({_id, name, email}){
        this._id = _id;
        this.name = name;
        this.email = email;
    }
}