import {encode} from '../jwt/jwt.encode';
import crypto from 'crypto';
import {cryptoConfig} from '../../config/crypto.config';
import {ErrorWithStatusCode} from '../../handlers/errorhandler';

class setJwt {
    constructor({_id, password, salt, userPassword}) {
        if(!_id){
            throw new ErrorWithStatusCode(422, '_id not found', 'to create a jwt token, valid value of ');
        }
        if(!setJwt.compareHash(password, userPassword, salt, cryptoConfig.iterations)){
            throw new ErrorWithStatusCode(401, 'invalid password', 'The password didn\'t match');
        }
        this._id = _id;
        this.token = setJwt.generateToken({_id: _id});
    }

    static generateToken(payload) {
        return encode(payload);
    }

    static compareHash(password, userPassword, salt, iterations){
        return password === hashPassword.generateHash(userPassword, salt, iterations);
    }
}

class parseUser {
    constructor({_id, email}) {
        this._id = _id;
        this.email = email;
    }
}

class hashPassword {
    constructor({email, password}) {
        if(!password){
            throw new ErrorWithStatusCode(422, 'Email or password not found.', 'hashPassword class requires email and password in the object.');
        } else {

            this.email = email;
            this.salt = hashPassword.generateSalt();
            this.password = hashPassword.generateHash(password, this.salt, cryptoConfig.iterations);
        }
    }

    static generateSalt() {
        return crypto.randomBytes(256).toString('base64');
    }

    static generateHash(password, salt, iterations) {
        return crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha512').toString('base64');
    }
}

class getUser {
    constructor({_id, name, email, title, testimonials, about, pitch, projects, social, salt, password, profileImage}){
        this._id = _id;
        this.email = email;
        this.name = name;
        this.title = title;
        this.about = about;
        this.projects = projects;
        this.social = social;
        this.pitch = pitch;
        this.salt = salt;
        this.password = password;
        this.testimonials = testimonials;
        this.profileImage = profileImage;
    }
}

class updateUserLayer extends getUser {
    constructor({data, password, salt}){
        super(data);
        this.password = password;
        this.salt = salt;
    }
}

export {setJwt, hashPassword, parseUser, getUser, updateUserLayer};