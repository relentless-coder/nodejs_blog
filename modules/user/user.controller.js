import {findSingle, insert} from "../../services/mongodb/mongodb.service";
import {setJwt, hashPassword, parseUser} from "../../services/layers/user.layer";
import {responseHandler} from '../../handlers/response.handler';

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
      console.log('err is ', err);
      return responseHandler(res, err.code, err.message, err.error, true);
    })
  };

 return getReqBody().then(getUserJwt).catch((err) => {
    console.log("error is ", err);
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

  const createUser = (body) => {
    return insert('users', body, hashPassword, parseUser).then((data) => {
      return responseHandler(res, data.status, data.message, data.data);
    }).catch(err => responseHandler(res, err.code, err.message, err.error, true));
  };

 return getReqBody().then(createUser).catch((err)=> {console.log(err)})

}
