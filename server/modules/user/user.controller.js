import sanitize from 'sanitize-html';
import {setJwt, hashPassword, parseUser, getUser, updateUserLayer} from '../../services/layers/user.layer';
import {responseHandler} from '../../handlers/response.handler';
import {ErrorWithStatusCode} from '../../handlers/errorhandler';
import {connectMongo} from '../../config/mongo.config';
import {ObjectID} from 'mongodb';
import mongodb from '../../services/mongodb/mongodb.service';
import {renderView} from '../../handlers/render.view';
import {sidebar} from '../../config/sidebar';
import {uploadHandler} from '../../handlers/upload.handler';
import util from 'util'

const sanitizeOpt = {
    allowedTags: ['img', 'p', 'pre', 'code', 'strong', 'em'],
    allowedSchemes: ['data', 'http']
};

let userInput = {};

const checkIfUserExists = (body) => {
    userInput = body;
    let query = {
        email: userInput.email ? userInput.email : userInput.userEmail
    };
    const queryUser = (db) => {
        let localCollection = db.collection('users');
        return new Promise((resolve, reject) => {
            localCollection.findOne(query, (err, done) => {
                if (err) {
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
            if (req.body) {
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
        if (!user) {
            throw new ErrorWithStatusCode(404, 'Email isn\'t registered', 'This email isn\'t registered, kindly signup.');
        } else {
            let query = {
                email: userInput.userEmail
            };

            return mongodb.findSingle('users', query, setJwt, userInput).then((data) => {
                const options = {
                    status: data.status,
                    message: data.message,
                    data: {
                        token: data.data.token
                    }
                }

                const headers = [{name: 'Content-Type', value: 'application/json'}, {name: 'Set-Cookie', value: `authorization=${data.data.token};path=/`}];

                return responseHandler(res, options, headers);
            }).catch((err) => {
                if (err.error) {
                    throw new ErrorWithStatusCode(err.code, err.message, err.error);
                } else {
                    throw new ErrorWithStatusCode(500, 'Sorry, we are facing some issue right now. Please, try agaiin later.', err);
                }
            });
        }
    };

    return getReqBody().then(checkIfUserExists).then(getUserJwt).catch((err) => {
        const options = {
            status: err.status ? err.status : 500,
            data: util.format(err.error ? err.error : err),
            message: 'Sorry, we are facing some issue right now. Please, try again later.'
        };
        const headers = [{name: 'Content-Type', value: 'application/json'}]
        return responseHandler(res, options, headers);
    });


}

export function signup(req, res) {
    const getReqBody = () => {
        let body = [];
        return new Promise((resolve, reject) => {
            if (req.body) {
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
        if (data) {
            throw new ErrorWithStatusCode(422, 'Email already exists.', 'The email provided by the client already exists, kindly login with the same.');
        } else {
            return mongodb.insert('users', userInput, hashPassword, parseUser).then((data) => {
                const options = {
                    status: data.status,
                    data: data.data,
                    message: data.message
                }
                const headers = [{name: 'Content-Type', value: 'application/json'}];

                return responseHandler(res, options, headers);
            }).catch((err) => {
                if (err.error) {
                    throw new ErrorWithStatusCode(err.code, err.message, err.error);
                } else {
                    throw new ErrorWithStatusCode(500, 'Sorry, we seem to be facing some issue right now. Please, try again later.');
                }
            });
        }
    };

    return getReqBody().then(checkIfUserExists).then(createUser).catch(err => {
        const options = {
            status: err.status ? err.status : 500,
            message: 'Sorry, we are facing some issue right now. Please, try again later.',
            data: util.format(err.error)
        };

        const headers = [{name: 'Content-Type', value: 'application/json'}];

        return responseHandler(res, options, headers);

    })
}

export function renderProfile(req, res) {

    const findUser = () => {
        const query = {
            _id: ObjectID(res.payload)
        }

        return mongodb.findSingle('users', query, getUser)
    }

    const getView = (user) => {
        user.data.social = JSON.parse(user.data.social);
        return renderView('admin/src/components/user/update/user.ejs', {content: {sidebar, user: user.data}})
    }

    const sendResponse = (str) => {
        let options = {
            status: 200,
            data: str,
            message: 'Success'
        };

        const headers = [{name: 'Content-Type', value: 'text/html'}];

        return responseHandler(res, options, headers);
    }

    return findUser().then(getView).then(sendResponse).catch((err) => {
        let options = {
            status: 500,
            data: err.error,
            message: 'Sorry, we are facing some issue right now. Please, try again later.',
            content: 'text/plain'
        };

        const headers = [{name: 'Content-Type', value: 'text/html'}];

        return responseHandler(res, options, headers);
    });
}

export function renderSignin(req, res) {
    return renderView('admin/src/components/user/signin/signin.ejs', {}).then((str) => {
        let options = {
            status: 200,
            data: str,
            message: 'Success'
        };

        const headers = [{name: 'Content-Type', value: 'text/html'}]


        return responseHandler(res, options, headers);
    }).catch((err) => {
        let options = {
            status: 500,
            data: 'Sorry, we are facing some issue right now. Please, try again later.',
            message: 'Sorry, we are facing some issue right now. Please, try again later.'
        };

        const headers = [{name: 'Content-Type', value:  'text/plain'}];

        return responseHandler(res, options, headers);
    });
}

export function renderSignup(req, res) {
    return renderView('admin/src/components/user/signup/signup.ejs', {}).then((str) => {
        let options = {
            status: 200,
            data: str,
            message: 'Success',
            content: 'text/html'
        };


        return responseHandler(res, options);
    }).catch((err) => {
        let options = {
            status: 500,
            data: 'Sorry, we are facing some issue right now. Please, try again later.',
            message: 'Sorry, we are facing some issue right now. Please, try again later.',
            content: 'text/plain'
        };

        return responseHandler(res, options);
    });
}

export function updateUser(req, res) {

    let foundUser;
    const findUser = () => {
        const query = {
            _id: ObjectID(res.payload)
        };

        return mongodb.findSingle('users', query, getUser);
    };

    const getData = (user) => {
        foundUser = user.data;
        if (req.body) {
            return Promise.resolve(req);
        } else {
            return uploadHandler(req, res, 'profileImage');
        }
    };

    const updateDocument = () => {
        req.body.about = sanitize(req.body.about, sanitizeOpt);
        req.body._id = foundUser._id;
        const query = {
            _id: ObjectID(res.payload)
        };
        if (req.file) {
            req.body.profileImage = `uploads/${req.file.filename}`;
        }
        return mongodb.update('users', query, req.body, getUser, getUser);
    };

    const sendResponse = (data) => {
        delete data.password;
        delete data.salt;
        const options = {
            status: 200,
            message: 'User updated successfully',
            data
        };

        const headers = [{name: 'Content-Type', value: 'application/json'}];
        return responseHandler(res, options, headers);
    };

    return Promise.resolve().then(findUser).then(getData).then(updateDocument).then(sendResponse).catch((err) => {
        const options = {
            status: err.status ? err.status : 500,
            message: err.message ? err.message : 'Sorry, we are facing some issue right now. Please, try again later.',
            data: util.format(err)
        };

        const headers = [{name: 'Content-Type', value: 'application/json'}];

        return responseHandler(res, options, headers);
    });
}

export function getAuthor(req, res) {
    const query = {
        _id: ObjectID(res.payload)
    };

    return mongodb.findSingle('users', query, getUser).then((data) => {
        let options = {
            status: data.status,
            message: data.message,
            data: data.data
        };

        const headers = [{name: 'Content-Type', value: 'application/json'}]
        return responseHandler(res, options, headers);
    }).catch((err) => {

        const options = {
            status: err.status ? err.status : 500,
            message: err.message ? err.message : 'Sorry, we are facing some issue right now.',
            data: err
        };

        const headers = [{name: 'Content-Type', value: 'application/json'}]

        return responseHandler(res, options, headers);
    });
}
