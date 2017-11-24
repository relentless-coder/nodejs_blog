import {findSingle, insert} from "../../services/mongodb/mongodb.service";
import {setJwt, hashPassword, parseUser} from "../../services/layers/user.layer";
import {responseHandler} from '../../handlers/response.handler';
import {ErrorWithStatusCode} from '../../handlers/errorhandler';

export function signin(req, res) {

  const getReqBody = () => {
    let body = [];
    return new Promise((resolve, reject) => {
      if(req.body){
        resolve(req.body)
      } else {
        req.on('error', (err) => {
          reject(err)
        }).on('data', (data) => {
          body.push(data);
        }).on('end', () => {
          resolve(JSON.parse(Buffer.concat(body).toString()))
        })
      }
    })
  };

  const getUserJwt = (body) => {
    let query = {
      email: body.userEmail
    };
    return findSingle('users', query, setJwt, body).then((data) => {
      return responseHandler(res, data.status, data.message, data.data.token);
    }).catch((err) => {
      if(err.error){
        throw new ErrorWithStatusCode(err.code, err.message, err.error)
      } else{
        throw new ErrorWithStatusCode(500, 'Sorry, we are facing some issue right now. Please, try agaiin later.', err);
      }
    })
  };

 return getReqBody().then(getUserJwt).catch((err) => {
    return responseHandler(res, err.code, err.message, err.error, true);
  })


}

export function signup(req, res) {

  const getReqBody = () => {
    let body = [];
    return new Promise((resolve, reject) => {
      if(req.body){
        resolve(req.body);
      } else {
        req.on('error', (err) => {
          reject(err)
        }).on('data', (data) => {
          body.push(data);
        }).on('end', () => {
          resolve(JSON.parse(Buffer.concat(body).toString()))
        })
      }
    })
  };

  const checkIfUserExists = (body)=>{
    req.body = body;
    let query = {
      email: body.email
    };

    return findSingle('users', query, parseUser).then((data)=>{
      if(data.data.email){
        throw new ErrorWithStatusCode(422, 'Email already exists', 'The email submitted by the client already exists.')
      } else {
        return true
      }
    }).catch((err)=>{throw new ErrorWithStatusCode(err.code, err.message, err.error)});
  };

  const createUser = (data) => {
    return insert('users', req.body, hashPassword, parseUser).then((data) => {
      return responseHandler(res, data.status, data.message, data.data);
    }).catch((err) => {
      if (err.error) {
        throw new ErrorWithStatusCode(err.code, err.message, err.error)
      } else {
        throw new ErrorWithStatusCode(500, 'Sorry, we seem to be facing some issue right now. Please, try again later.')
      }
    });
  }

 return getReqBody().then(checkIfUserExists).then(createUser).catch(err => responseHandler(res, err.code, err.message, err.error))

}
