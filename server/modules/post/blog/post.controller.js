import {responseHandler} from '../../../handlers/response.handler';
import qs from 'querystring';
import {getPost} from '../../../services/layers/post.layer';
import mongo from '../../../services/mongodb/mongodb.service';
import ejs from 'ejs';

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
    data.data.meta.keywords = data.data.meta.keywords.join(',')
    ;    renderView('posts/single_post/single.post.ejs', {content: {post: data.data, meta: data.data.meta}})
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

        return responseHandler(res, options)
      })
  })
}