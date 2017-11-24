import {findAll, findSingle, insert, update, removeOne} from "../../services/mongodb/mongodb.service";
import {getProduct, addProduct, updateProduct} from "../../services/layers/product.layer";
import {upload} from "../../config/multer.config";
import {ObjectID} from 'mongodb';
import {ErrorWithStatusCode} from "../../handlers/errorhandler";
import {responseHandler} from '../../handlers/response.handler';


const fileUpload = upload.array('gallery');

export function getAllProducts(req, res) {
  return findAll('products', {}, getProduct).then((data) => {
    return responseHandler(res, data.status, data.message, data.data);
  }).catch((err) => {
    return responseHandler(res, data.status, data.message, data.error, true);
  })
}

export function getOneProduct(req, res) {
  let query = {
    '_id': ObjectID(req.params.productId)
  };
  return findSingle('products', query, getProduct).then((data) => {
    return responseHandler(res, data.status, data.message, data.data);
  })
}

export function addOneProduct(req, res) {

  const getData = () => {
    if(req.body){
      return Promise.resolve(req)
    } else {
      return new Promise((resolve, reject) => {
        fileUpload(req, res, (err) => {
          if (err) {
            reject(err)
          } else {
            let files = [];
            if (req.files) {
              req.files.forEach((file) => {
                files.push(file.path);
              });
              req.body.gallery = files;
            }

            resolve(req)

          }
        })
      })
    }

  };

  const addToDatabase = () => {
    return insert('products', req.body, addProduct, getProduct).then((data) => {
     return responseHandler(res, data.status, data.message, data.data);
    }).catch((err) => {
      if(err.error){
        throw new ErrorWithStatusCode(err.code, err.message, err.error)
      }
    })
  };

  return getData().then(addToDatabase).catch((err) => {
    if (err.code && err.message) {
      return responseHandler(res, err.code, err.message, err.error, true);
    } else {
      return responseHandler(res, 500, 'Sorry, we are facing some issue right now. Please, try again later.', err, true);
    }
  })
}

export function updateOneProduct(req, res) {

  const getData = () => {
    if(req.body){
      return Promise.resolve(req)
    } else {
      return new Promise((resolve, reject) => {
        fileUpload(req, res, (err) => {
          if (err) {
            reject(err)
          } else {
            if (req.files) {
              req.files.forEach((file) => {
                req.body.gallery.push(file.path);
              });
            }
            resolve(req)
          }

        })
      })
    }

  };

  const addToDatabase = () => {
    return update('products', {_id: req.params.productId}, req.body, updateProduct, getProduct).then((data) => {
      return responseHandler(res, data.status, data.message, data.data);
    }).catch((err) => {
      throw new ErrorWithStatusCode(err.code, err.message, err.error)
    })
  };

  return getData().then(addToDatabase).catch((err) => {
    if (err.code && err.message) {
      return responseHandler(res, err.code, err.message, err.error, true);
    } else {
      return responseHandler(res, 500, 'Sorry, we are facing some issue right now. Please, try again later.', err, true);
    }
  })
}

export function removeOneProduct(req, res) {
  let query = {
    _id: ObjectID(req.params.productId)
  };

 return removeOne('products', query).then((data) => {
    return responseHandler(res, data.status, data.message, data.data);
  }).catch((err) => {
    return responseHandler(res, err.code, err.message, err.error, true);
  })
}