import {setJwt, hashPassword, parseUser} from '../../services/layers/user.layer';
import {responseHandler} from '../../handlers/response.handler';
import {ErrorWithStatusCode} from '../../handlers/errorhandler';
import {connectMongo} from '../../config/mongo.config';
import {ObjectID} from 'mongodb';
import mongodb from '../../services/mongodb/mongodb.service';
import {getUser} from '../../services/layers/user.layer';
import {renderView} from '../../handlers/render.view';
import {sidebar} from '../../config/sidebar';
import {uploadHandler} from '../../handlers/upload.handler';

let userInput = {};

const checkIfUserExists = (body)=>{
    userInput = body;
    let query = {
        email: userInput.email ? userInput.email : userInput.userEmail
    };
    const queryUser = (db)=>{
        let localCollection = db.collection('users');
        return new Promise((resolve, reject)=>{
            localCollection.findOne(query, (err, done)=>{
                if(err){
                    db.close();
                    reject(err);
                } else {
                    db.close();
                    resolve(done);
                }
            });
        });
    };

    return connectMongo().then(queryUser);

};

export function signin(req, res) {
    const getReqBody = () => {
        let body = [];
        return new Promise((resolve, reject) => {
            if(req.body){
                resolve(req.body);
            } else {
                req.on('error', (err) => {
                    reject(err);
                }).on('data', (data) => {
                    body.push(data);
                }).on('end', () => {
                    resolve(JSON.parse(Buffer.concat(body).toString()));
                });
            }
        });
    };

    const getUserJwt = (user) => {
        if(!user){
            throw new ErrorWithStatusCode(404, 'Email isn\'t registered', 'This email isn\'t registered, kindly signup.');
        } else {
            let query = {
                email: userInput.userEmail
            };

            return mongodb.findSingle('users', query, setJwt, userInput).then((data) => {
                return responseHandler(res, data.status, data.message, data.data.token);
            }).catch((err) => {
                if(err.error){
                    throw new ErrorWithStatusCode(err.code, err.message, err.error);
                } else{
                    throw new ErrorWithStatusCode(500, 'Sorry, we are facing some issue right now. Please, try agaiin later.', err);
                }
            });
        }
    };

    return getReqBody().then(checkIfUserExists).then(getUserJwt).catch((err) => {
        return responseHandler(res, err.code, err.message, err.error, true);
    });


}

export function signup(req, res) {
    const getReqBody = () => {
        let body = [];
        return new Promise((resolve, reject) => {
            if(req.body){
                resolve(req.body);
            } else {
                req.on('error', (err) => {
                    reject(err);
                }).on('data', (data) => {
                    body.push(data);
                }).on('end', () => {
                    resolve(JSON.parse(Buffer.concat(body).toString()));
                });
            }
        });
    };

    const createUser = (data) => {
        if(data){
            throw new ErrorWithStatusCode(422, 'Email already exists.', 'The email provided by the client already exists, kindly login with the same.');
        } else {
            return mongodb.insert('users', userInput, hashPassword, parseUser).then((data) => {
                return responseHandler(res, data.status, data.message, data.data);
            }).catch((err) => {
                if (err.error) {
                    throw new ErrorWithStatusCode(err.code, err.message, err.error);
                } else {
                    throw new ErrorWithStatusCode(500, 'Sorry, we seem to be facing some issue right now. Please, try again later.');
                }
            });
        }
    };

    return getReqBody().then(checkIfUserExists).then(createUser).catch(err => responseHandler(res, err.code, err.message, err.error));

}

export function renderProfile(req, res) {
    return renderView('admin/src/components/user/user.ejs', {content: {sidebar}}).then((str)=>{
        let options = {
            status: 200,
            data: str,
            message: 'Success',
            content: 'text/html'
        };

        console.log(options);

        return responseHandler(res, options);
    }).catch((err)=>{
        console.log(err);
        let options = {
            status: 500,
            data: 'Sorry, we are facing some issue right now. Please, try again later.',
            message: 'Sorry, we are facing some issue right now. Please, try again later.',
            content: 'text/plain'
        };

        return responseHandler(res, options);
    });
}

export function updateUser(req, res, next) {
    const getData = ()=>{
        if(req.body){
            return Promise.resolve(req);
        } else {
            return uploadHandler(req, res, 'profileImage');
        }
    };

    const updateUser = (data)=>{
        console.log(req.body);
    };

    return Promise.resolve().then(getData).then(updateUser).catch((err)=>{
        console.log(err);
    });
}

export function getAuthor(req, res) {
    const query = {
        _id: ObjectID(res.payload)
    };

    return mongodb.findSingle('users', query, getUser).then((data)=>{
        let options = {
            status: data.status,
            message: data.message,
            data: data.data,
            content: 'application/json'
        };
        return responseHandler(res, options);
    }).catch((err)=>{

        const options = {
            status: err.status ? err.status : 500,
            message: err.message ? err.message : 'Sorry, we are facing some issue right now.',
            data: err,
            content: 'application/json'
        };

        return responseHandler(res, options);
    });
}
