import qs from 'querystring';
import fs from 'fs';
import ejs from 'ejs';
import mongo from "../../services/mongodb/mongodb.service";
import {addPost, getPost, updatePost} from "../../services/layers/post.layer";
import {ObjectID} from 'mongodb';
import {ErrorWithStatusCode} from "../../handlers/errorhandler";
import {responseHandler} from '../../handlers/response.handler';
import fileUpload from '../../handlers/upload.handler';



const renderView = (path, data)=>{
  const viewDirectory = './client/views/';
  return new Promise((resolve, reject) => {
    ejs.renderFile(`${viewDirectory}${path}`, data, (err, str)=>{
      if(err) {
        reject(err);
      } else
        resolve(str)
    })
  })
};

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
  return mongo.findAll('posts', query, getPost).then((data) => {
    renderView('posts/all_posts/all.post.ejs', {content: {post: data.data, meta: {title: 'Ayush Bahuguna', description: 'Hello, I am Ayush Bahuguna', keywords: 'hello,world'}}}).then((str)=>{
      const options = {
        status: data.status,
        message: data.message,
        data: str,
        content: 'text/html'
      };
      return responseHandler(res, options);
    })

  }).catch((err) => {
    return responseHandler(res, {status: err.status, message: err.message, data: err.error, content: 'application/json'});
  })
}

export function getOnePost(req, res) {
  let query = {
    'url': req.params.url
  };
  return mongo.findSingle('posts', query, getPost).then((data) => {
    renderView('posts/single_post/single.post.ejs', {content: {post: data.data, meta: data.data.meta}})
      .then((clientData)=>{
        let options = {
          status: data.status,
          message: data.message,
          data: clientData,
          content: 'text/html'
        };
        return responseHandler(res, options);
      }).catch((err)=>{
        let options = {
          status: err.status ? err.status : 500,
          message: err.message ? err.message : 'Sorry, we are facing some issue right now.',
          data: err,
          content: 'application/json'
        }
    })
  })
}

export function addOnePost(req, res) {

  const getData = () => {
    if (req.body) {
      return Promise.resolve(req)
    } else {
      return fileUpload(req, res, 'image')
    }
  };

  const addToDatabase = () => {
    return mongo.insert('posts', req.body, addPost, getPost).then((data) => {
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
    return mongo.update('posts', {
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
  };

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