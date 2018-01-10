import moment from 'moment-timezone';
import { decode } from '../services/jwt/jwt.decode';
import { findSingle } from '../services/mongodb/mongodb.service';
import { ObjectID } from 'mongodb';
import { parseUser } from "../services/layers/user.layer";
import { ErrorWithStatusCode } from './errorhandler';
import { responseHandler } from './response.handler';

function authHandler(req, res, next) {

  let payload;
  try {
    payload = decode(req);
    let expTime = moment.tz(payload.exp, 'GMT').toDate();
    let currentTIme = moment.tz('GMT').toDate();

    if (currentTIme > expTime) {
      return responseHandler(res, 401, 'Unauthorized request', 'The jwt token provided by the client has expired. Kindly, login again.', true)
    } else {
      let query = {
        _id: ObjectID(payload._id)
      };

      findSingle('users', query, parseUser).then((data) => {
        if (data) {
          req.user = data;
          return next()
        } else {
          return responseHandler(res, 401, 'Unauthorized request', 'User doesn\'t exist', true)
        }
      }).catch((err) => {
        return responseHandler(res, 500, 'Sorry, we seem to be facing some issue right now. Please, try again later.', err, true)
      })
    }
  } catch (err) {
    return responseHandler(res, err.code, err.message, err.error, true);
  }

}

export { authHandler }