import {findAll, findSingle, insert, update, removeOne} from "../../services/mongodb/mongodb.service";
import {getProduct, addProduct, updateProduct} from "../../services/layers/product.layer";
import {upload} from "../../config/multer.config";
import {ObjectID} from 'mongodb';
import {ErrorWithStatusCode} from "../../handlers/errorhandler";
import {responseHandler} from '../../handlers/response.handler';


const fileUpload = upload.array('gallery');

export function getAllProducts(req, res) {
  findAll('products', {}, getProduct).then((data) => {
    responseHandler(res, data.status, data.message, data.data);
  }).catch((err) => {
    responseHandler(res, data.status, data.message, data.error, true);
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
    return new Promise((resolve, reject) => {
      fileUpload(req, res, (err) => {
        if (err) {
          console.log(err);
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

  };

  const addToDatabase = () => {
    return insert('products', req.body, addProduct, getProduct).then((data) => {
      responseHandler(res, data.status, data.message, data.data);
    }).catch((err) => {
      responseHandler(res, data.staus, data.message, data.error);
    })
  };

  getData().then(addToDatabase).catch((err) => {
    if (err.code && err.message) {
      responseHandler(res, err.code, err.message, err.error, true);
    } else {
      responseHandler(res, 500, 'Sorry, we are facing some issue right now. Please, try again later.', err, true);
    }
  })
}

export function updateOneProduct(req, res) {

  const getData = () => {
    return new Promise((resolve, reject) => {
      fileUpload(req, res, (err) => {
        if (err) {
          console.log("upload error ", err);
          reject(err)
        } else {
          if (req.files) {
            console.log('we have files', req.files);
            req.files.forEach((file) => {
              req.body.gallery.push(file.path);
            });
          }
          resolve(req)
        }

      })
    })

  };

  const addToDatabase = () => {
    return update('products', {_id: req.params.productId}, req.body, updateProduct, getProduct).then((data) => {
      responseHandler(res, data.status, data.message, data.data);
    }).catch((err) => {
      responseHandler(res, 500, 'Sorry, we are facing some issue right now. Please, try again later.', err, true);
    })
  };

  getData().then(addToDatabase).catch((err) => {
    if (err.code && err.message) {
      responseHandler(res, err.code, err.message, err.error, true);
    } else {
      responseHandler(res, 500, 'Sorry, we are facing some issue right now. Please, try again later.', err, true);
    }
  })
}

export function removeOneProduct(req, res) {
  let query = {
    _id: ObjectID(req.params.productId)
  };

  removeOne('products', query).then((data) => {
    responseHandler(res, data.status, data.message, data.data);
  }).catch((err) => {
    responseHandler(res, err.code, err.message, err.error, true);
  })
}