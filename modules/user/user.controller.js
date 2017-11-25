import {findSingle, insert} from "../../services/mongodb/mongodb.service";
import {setJwt, hashPassword, parseUser} from "../../services/layers/user.layer";
import {responseHandler} from '../../handlers/response.handler';
import {ErrorWithStatusCode} from '../../handlers/errorhandler';
import {connectMongo} from '../../config/mongo.config';

let userInput;

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
            db.close()
            reject(err)
          } else {
            db.close()
            resolve(done)
          }
        })
      })
    };

    return connectMongo().then(queryUser)

};

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

  const getUserJwt = (user) => {
    if(!user){
      throw new ErrorWithStatusCode(404, 'Email isn\'t registered', 'This email isn\'t registered, kindly signup again.')
    } else {
      let query = {
        email: userInput.userEmail
      };
      return findSingle('users', query, setJwt, userInput).then((data) => {
        return responseHandler(res, data.status, data.message, data.data.token);
      }).catch((err) => {
        if(err.error){
          throw new ErrorWithStatusCode(err.code, err.message, err.error)
        } else{
          throw new ErrorWithStatusCode(500, 'Sorry, we are facing some issue right now. Please, try agaiin later.', err);
        }
      })
    }
  };

 return getReqBody().then(checkIfUserExists).then(getUserJwt).catch((err) => {
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

  const createUser = (data) => {
    if(data){
      throw new ErrorWithStatusCode(422, 'Email already exists.', 'The email provided by the client already exists, kindly login with the same.')
    } else {
      return insert('users', userInput, hashPassword, parseUser).then((data) => {
        return responseHandler(res, data.status, data.message, data.data);
      }).catch((err) => {
        if (err.error) {
          throw new ErrorWithStatusCode(err.code, err.message, err.error)
        } else {
          throw new ErrorWithStatusCode(500, 'Sorry, we seem to be facing some issue right now. Please, try again later.')
        }
      });
    }
  }

 return getReqBody().then(checkIfUserExists).then(createUser).catch(err => responseHandler(res, err.code, err.message, err.error))

}
