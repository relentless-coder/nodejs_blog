import crypto from 'crypto';
import {cryptoConfig} from "../config/crypto.config";
import {decode} from "../services/jwt/jwt.decode";
import {findSingle} from "../services/mongodb/mongodb.service";
import {ObjectID} from 'mongodb';
import {parseUser} from "../services/layers/user.layer";

function authHandler(req, res, next) {
  if(!req.headers.authorization){
    res.writeHead(401, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({status: 401, message: 'Unauthorized request', error: 'The server' +
    ' didn\'t find any' +
    ' jwt token in the request header. The format is: Authorization: Bearer [token]'}))
    return false
  } else {

    let payload = decode(req);
    let query = {
      _id: ObjectID(payload._id);
    }

    findSingle('users', query, parseUser).then((data)=>{
      if(data){
        req.user = data;
        next()
      } else {
        res.writeHead(401, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({status: 401, message: 'Unauthorized request', error: 'The user' +
        ' doesn\'t' +
        ' exist.'}))
        return false
      }
    }).catch((err)=>{
      res.writeHead(500, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({status: 500, message: 'Sorry, we seem to be facing some issue right' +
      ' now.' +
      ' Please, try again later.', error: err}))
    })
  }
}

export {authHandler}