import {
  findAll,
  findSingle,
  insert,
  update,
  removeOne
} from "../../services/mongodb/mongodb.service";
import {
  getPost,
  addPost,
  updatePost
} from "../../services/layers/post.layer";
import {
  upload
} from "../../config/multer.config";
import {
  ObjectID
} from 'mongodb';
import {
  ErrorWithStatusCode
} from "../../handlers/errorhandler";
import {
  responseHandler
} from '../../handlers/response.handler';
import qs from 'querystring';

const fileUpload = upload.array('gallery');

export function getAllPosts(req, res) {
  let query = {};
  if (req._parsedUrl.query) {
    let parsedQuery = qs.parse(req._parsedUrl.query);
    query = {
      '$text': {
        '$search': parsedQuery.search
      }
    }
  }
  return findAll('posts', query, getPost).then((data) => {
    data.data.forEach((el) => {
      let links = [];
      links.push({
        href: `https://api.ayushbahuguna.com/api/v1/posts/${el._id}`,
        rel: 'self',
        method: 'GET'
      }, {
        href: `https://api.ayushbahuguna.com/api/v1/posts/${el._id}`,
        rel: 'update',
        method: 'PUT'
      }, {
        href: `https://api.ayushbahuguna.com/api/v1/posts/${el._id}`,
        rel: 'remove',
        method: 'DELETE'
      });
      el.links = links;
    })
    return responseHandler(res, data.status, data.message, data.data);
  }).catch((err) => {
    return responseHandler(res, data.status, data.message, data.error, true);
  })
}

export function getOnePost(req, res) {
  let query = {
    '_id': ObjectID(req.params.postId)
  };
  return findSingle('posts', query, getPost).then((data) => {
    
    return responseHandler(res, data.status, data.message, data.data);
  })
}

export function addOnePost(req, res) {

  const getData = () => {
    if (req.body) {
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
    return insert('posts', req.body, addPost, getPost).then((data) => {
      let links = [];
      links.push({
        href: `https://api.ayushbahuguna.com/api/v1/posts/${data.data._id}`,
        rel: 'self',
        method: 'GET'
      }, {
        href: `https://api.ayushbahuguna.com/api/v1/posts/${data.data._id}`,
        rel: 'update',
        method: 'PUT'
      }, {
        href: `https://api.ayushbahuguna.com/api/v1/posts/${data.data._id}`,
        rel: 'remove',
        method: 'DELETE'
      });
      data.data.links = links;
      return responseHandler(res, data.status, data.message, data.data);
    }).catch((err) => {
      if (err.error) {
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

export function updateOnePost(req, res) {

  const getData = () => {
    if (req.body) {
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
    req.body._id = ObjectID(req.params.postId);
    return update('posts', {
      _id: ObjectID(req.params.postId)
    }, req.body, updatePost, getPost).then((data) => {
      let links = [];
      links.push({
        href: `https://api.ayushbahuguna.com/api/v1/posts/${data.data._id}`,
        rel: 'self',
        method: 'GET'
      }, {
        href: `https://api.ayushbahuguna.com/api/v1/posts/${data.data._id}`,
        rel: 'remove',
        method: 'DELETE'
      });
      data.data.links = links;
      return responseHandler(res, data.status, data.message, data.data);
    }).catch((err) => {
      throw new ErrorWithStatusCode(err.code, err.message, err.error)
    })
  }

  return getData().then(addToDatabase).catch((err) => {
    if (err.code && err.message) {
      return responseHandler(res, err.code, err.message, err.error, true);
    } else {
      return responseHandler(res, 500, 'Sorry, we are facing some issue right now. Please, try again later.', err, true);
    }
  })
}

export function removeOnePost(req, res) {
  let query = {
    _id: ObjectID(req.params.postId)
  };

  return removeOne('posts', query).then((data) => {
    let links = [];
    links.push({
      href: `https://api.ayushbahuguna.com/api/v1/posts`,
      rel: 'list',
      method: 'GET'
    }, {
      href: `https://api.ayushbahuguna.com/api/v1/posts`,
      rel: 'add',
      method: 'POST'
    });
    data.data.links = links;
    return responseHandler(res, data.status, data.message, data.data);
  }).catch((err) => {
    return responseHandler(res, err.code, err.message, err.error, true);
  })
}