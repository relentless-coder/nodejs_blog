import {findSingle, insert} from "../../services/mongodb/mongodb.service";
import {setJwt, hashPassword} from "../../services/layers/user.layer";

export function signin(req, res) {

  const getReqBody = () => {
    let body = [];
    return new Promise((resolve, reject) => {
      req.on('error', (err) => {
        reject(err)
      }).on('data', (data) => {
        body.push(data);
      }).on('end', () => {
        resolve(JSON.parse(Buffer.concat(body).toString()))
      })
    })
  };

  const getUserJwt = (body) => {
    let query = {
      email: body.email
    };
    findSingle('users', query, setJwt).then((data) => {
      res.writeHead(data.status, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({token: data.data.token}))
    }).catch((err) => {
      res.writeHead(err.status, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({status: err.status, message: err.message, error: err.error}))
    })
  };

  getReqBody().then(getUserJwt).catch((err) => {
    console.log("error is ", err);
  })


}

export function signup(req, res) {
  const getReqBody = () => {
    let body = [];
    return new Promise((resolve, reject) => {
      req.on('error', (err) => {
        reject(err)
      }).on('data', (data) => {
        body.push(data);
      }).on('end', () => {
        resolve(JSON.parse(Buffer.concat(body).toString()))
      })
    })
  };

  const createUser = (body) => {
    insert('users', body, hashPassword, setJwt).then((data) => {
      console.log(data.data[0]);
      res.writeHead(data.status, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({token: data.data[0].token}))
    }).catch((err) => {
      res.writeHead(err.status, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({status: err.status, message: err.message, error: err.error}))
    })
  }

  getReqBody().then(createUser).catch((err) => {

  })

}
