import moment from 'moment-timezone';
import {decode} from '../services/jwt/jwt.decode';
import mongodb from '../services/mongodb/mongodb.service';
import {ObjectID} from 'mongodb';
import {parseUser} from '../services/layers/user.layer';
import {responseHandler} from './response.handler';

function authHandler(req, res, next) {

    let payload;
    try {
        payload = decode(req);
        let expTime = moment.tz(payload.exp, 'GMT').toDate();
        let currentTIme = moment.tz('GMT').toDate();

        if (currentTIme > expTime) {
            const options = {
                status: 401,
                message: 'Unauthorized request',
                data: 'The jwt token provided by the client has expired. Kindly, login again.',
                content: 'application/json'
            }
            return responseHandler(res, options);
        } else {
            let query = {
                _id: ObjectID(payload._id)
            };

            return mongodb.findSingle('users', query, parseUser).then((data) => {
                if (data) {
                    res.payload = data.data._id;
                    return next();
                } else {
                    const options = {
                        status: 401,
                        message: 'Unauthorized request',
                        data: 'User doesn\'t exist',
                        content: 'application/json'
                    }
                    return responseHandler(res, options);
                }
            }).catch((err) => {
                const options = {
                    status: 500,
                    message: 'Sorry, we seem to be facing some issue right now. Please, try again later.',
                    data: util.format(err)
                }
                const headers = [{name: 'Content-Type', value: 'application/json'}];
                return responseHandler(res, options, headers);
            });
        }
    } catch (err) {
        const options = {
            status: err.status ? err.status : 500,
            message: err.message,
            data: err.error
        }
        const headers = [{name: 'Content-Type', value: 'application/json'}];
        return responseHandler(res, options, headers);
    }

}

export { authHandler };