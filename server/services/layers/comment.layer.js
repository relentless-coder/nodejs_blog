import {ErrorWithStatusCode} from '../../handlers/errorhandler';

class addComment {
    constructor({author, comment}){
        if(!author.name || !author.email || !comment)
            throw new ErrorWithStatusCode(422, 'Cannot post this comment without complete data.', 'Name, email and comment are required.');
        this.author = author;
        this.comment = comment;
    }
}

class getComment {
    constructor({_id, author, comment, comments}){
        this._id = _id;
        this.author = author;
        this.comment = comment;
        this.comments = comments || [];
    }
}

export {addComment, getComment};