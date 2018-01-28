import qs from 'querystring';
import ejs from 'ejs';
import sanitize from 'sanitize-html';
import mongo from '../../services/mongodb/mongodb.service';
import {addPost, getPost, updatePost} from '../../services/layers/post.layer';
import {ObjectID} from 'mongodb';
import {ErrorWithStatusCode} from '../../handlers/errorhandler';
import {responseHandler} from '../../handlers/response.handler';
import fileUpload from '../../handlers/upload.handler';
import {addComment, getComment} from '../../services/layers/comment.layer';

const sanitizeOpt = {
    allowedTags: ['img', 'p', 'pre', 'code'],
    allowedSchemes: ['data', 'http']
};

const renderView = (path, data)=>{
    const viewDirectory = './client/';
    return new Promise((resolve, reject) => {
        ejs.renderFile(`${viewDirectory}${path}`, data, (err, str)=>{
            if(err) {
                reject(err);
            } else
                resolve(str);
        });
    });
};

export function getAllPosts(req, res) {
    let query = {};
    if (req._parsedUrl.query) {
        let parsedQuery = qs.parse(req._parsedUrl.query);
        query = {
            '$text': {
                '$search': parsedQuery.search
            }
        };
    }
    return mongo.findAll('posts', query, getPost).then((data) => {
        renderView('/blog/components/posts/all_posts/all.post.ejs', {content: {post: data.data, meta: {title: 'Ayush Bahuguna', description: 'Hello, I am Ayush Bahuguna', keywords: 'hello,world'}}}).then((str)=>{
            const options = {
                status: data.status,
                message: data.message,
                data: str,
                content: 'text/html'
            };
            return responseHandler(res, options);
        });

    }).catch((err) => {
        return responseHandler(res, {status: err.status, message: err.message, data: err.error, content: 'application/json'});
    });
}

export function getOnePost(req, res) {
    let query = {
        'url': req.params.url
    };
    return mongo.findSingle('posts', query, getPost).then((data) => {
        data.data.meta.keywords = data.data.meta.keywords.join(',');
        renderView('/blog/components/posts/single_post/single.post.ejs', {content: {post: data.data, meta: data.data.meta}})
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
                };

                return responseHandler(res, options);
            });
    });
}

export function addOnePost(req, res) {

    const getData = () => {
        if (req.body) {
            return Promise.resolve(req);
        } else {
            return fileUpload(req, res, 'image');
        }
    };

    const addToDatabase = () => {
        req.body.content = sanitize(req.body.content, sanitizeOpt);
        return mongo.insert('posts', req.body, addPost, getPost).then((data) => {
            return responseHandler(res, data.status, data.message, data.data);
        }).catch((err) => {
            if (err.error) {
                throw new ErrorWithStatusCode(err.code, err.message, err.error);
            }
        });
    };

    return getData().then(addToDatabase).catch((err) => {
        if (err.code && err.message) {
            return responseHandler(res, err.code, err.message, err.error, true);
        } else {
            return responseHandler(res, 500, 'Sorry, we are facing some issue right now. Please, try again later.', err, true);
        }
    });
}

export function updateOnePost(req, res) {

    const getData = () => {
        if (req.body) {
            return Promise.resolve(req);
        } else {
            return new Promise((resolve, reject) => {
                fileUpload(req, res, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (req.files) {
                            req.files.forEach((file) => {
                                req.body.gallery.push(file.path);
                            });
                        }
                        resolve(req);
                    }

                });
            });
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
            throw new ErrorWithStatusCode(err.code, err.message, err.error);
        });
    };

    return getData().then(addToDatabase).catch((err) => {
        if (err.code && err.message) {
            return responseHandler(res, err.code, err.message, err.error, true);
        } else {
            return responseHandler(res, 500, 'Sorry, we are facing some issue right now. Please, try again later.', err, true);
        }
    });
}

export function removeOnePost(req, res) {
    let query = {
        url: req.params.url
    };

    return mongo.removeOne('posts', query).then((data) => {
        let links = [];
        links.push({
            href: 'https://api.ayushbahuguna.com/api/v1/posts',
            rel: 'list',
            method: 'GET'
        }, {
            href: 'https://api.ayushbahuguna.com/api/v1/posts',
            rel: 'add',
            method: 'POST'
        });
        data.data.links = links;
        return responseHandler(res, data.status, data.message, data.data);
    }).catch((err) => {
        return responseHandler(res, err.code, err.message, err.error, true);
    });
}

export function addOneComment(req, res) {

    let foundPost, createdComment;

    const getRequestBody = ()=>{
        const body = [];
        return new Promise((resolve, reject) => {
            req.on('error', err => reject(err)).on('data', (data)=>{
                body.push(data);
            }).on('end', ()=>{
                resolve(JSON.parse(Buffer.concat(body).toString()));
            });
        });
    };

    const findPost = (body)=>{
        req.body = body;
        req.body.comment = sanitize(req.body.comment, sanitizeOpt);
        const query = {
            url: req.params.url
        };

        return mongo.findSingle('posts', query, getPost);
    };

    const createComment = (data)=>{
        foundPost = data.data;

        return mongo.insert('comments', req.body, addComment, getComment);
    };

    const updatePostWithComment = (data)=>{
        createdComment = data.data;
        foundPost.comments.push(createdComment);

        const query = {
            url: req.params.url
        };

        console.log(foundPost, updatePost);

        return mongo.update('posts', query, foundPost, updatePost, getPost);
    };

    const sendResponse = (data)=>{
        let options = {
            status: data.status,
            message: 'Comment posted successfully',
            data: createdComment,
            content: 'application/json'
        };

        return responseHandler(res, options);
    };

    return getRequestBody().then(findPost).then(createComment).then(updatePostWithComment).then(sendResponse).catch((err)=>{
        console.log('error is ', err);
        let options = {
            status: err.status || 500,
            message: err.message || 'Sorry, we are facing some issue right now. Please, try again later',
            data: err.error,
            content: 'application/json'
        };
        return responseHandler(res, options);
    });

}

export function renderNewPost(req, res){
    return renderView('admin/components/posts/new_post/new.post.ejs', {content: {meta: {title: 'Ayush Bahuguna', keywords: 'admin,new post,ayush bahuguna', description: 'This is admin panel where Ayush bahuguna creates new post'}}})
        .then((str)=>{
            let options = {
                data: str,
                status: 200,
                message: 'Serving new post template',
                content: 'text/html'
            };

            return responseHandler(res, options);
        }).catch((err)=>{
            let options = {
                status: 500,
                message: 'Sorry, we are facing some issue right now. Please, try again later.',
                data: err.error,
                content: 'json/application'
            };

            return responseHandler(res, options);
        });
}



















