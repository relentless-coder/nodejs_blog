import qs from 'querystring';
import {sidebar} from '../../config/sidebar.js';
import sanitize from 'sanitize-html';
import mongo from '../../services/mongodb/mongodb.service';
import {addPost, getPost, updatePost} from '../../services/layers/post.layer';
import {ObjectID} from 'mongodb';
import {ErrorWithStatusCode} from '../../handlers/errorhandler';
import {responseHandler} from '../../handlers/response.handler';
import {addComment, getComment} from '../../services/layers/comment.layer';
import {renderView} from '../../handlers/render.view.js';
import {uploadHandler} from '../../handlers/upload.handler.js';

const sanitizeOpt = {
    allowedTags: ['img', 'p', 'pre', 'code', 'strong', 'em'],
    allowedSchemes: ['data', 'http']
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
        return renderView('blog/src/components/posts/all_posts/all.post.ejs', {content: {post: data.data, meta: {title: 'Posts | Ayush Bahuguna', description: 'Here you can find tutorials on web development topics that are much more relevant to your professional career', keywords: 'nodejs tutorials, mongodb tutorials, javascript tutorials'}}}).then((str)=>{
            const options = {
                status: data.status,
                message: data.message,
                data: str
            };
            const headers = [{name: 'Content-Type', value: 'text/html'}];
            return responseHandler(res, options, headers);
        });

    }).catch((err) => {
        return responseHandler(res, {status: err.status, message: err.message, data: err.error}, [{name: 'Content-Type', value: 'application/json'}]);
    });
}

export function getOnePost(req, res) {
    let query = {
        'url': req.params.url
    };
    return mongo.findSingle('posts', query, getPost).then((data) => {
        renderView('blog/src/components/posts/single_post/single.post.ejs', {content: {post: data.data, meta: data.data.meta}})
            .then((clientData)=>{
                let options = {
                    status: data.status,
                    message: data.message,
                    data: clientData
                };
                const headers = [{name: 'Content-Type', value: 'text/html'}];
                return responseHandler(res, options, headers);
            }).catch((err)=>{
                let options = {
                    status: err.status ? err.status : 500,
                    message: err.message ? err.message : 'Sorry, we are facing some issue right now.',
                    data: err
                };
                const headers = [{name: 'Content-Type', value: 'application/json'}];
                return responseHandler(res, options, headers);
            });
    });
}

export function addOnePost(req, res) {

    const getData = () => {
        if (req.body) {
            return Promise.resolve(req);
        } else {
            return uploadHandler(req, res, 'image');
        }
    };

    const addToDatabase = () => {
        req.body.content = sanitize(req.body.content, sanitizeOpt);
        return mongo.insert('posts', req.body, addPost, getPost).then((data) => {
            let options = {
                status: data.status,
                message: data.message,
                data: data.data
            };
            const headers = [{name: 'Content-Type', value: 'text/html'}];
            return responseHandler(res, options, headers);
        }).catch((err) => {
            if (err.error) {
                throw new ErrorWithStatusCode(err.status, err.message, err.error);
            }
        });
    };

    return getData().then(addToDatabase).catch((err) => {
        let options = {
            status: err.status ? err.status : 500,
            message: err.message ? err.message : 'Sorry, we are facing some issue right now.',
            data: err
        };
        const headers = [{name: 'Content-Type', value: 'application/json'}];
        return responseHandler(res, options, headers);
    });
}

export function updateOnePost(req, res) {

    const getData = () => {
        if (req.body) {
            return Promise.resolve(req);
        } else {
            return new Promise((resolve, reject) => {
                uploadHandler(req, res, (err) => {
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
            let options = {
                status: data.status,
                message: data.message,
                data: data.data
            };
            const headers = [{name: 'Content-Type', value: 'text/html'}];
            return responseHandler(res, options, headers);
        }).catch((err) => {
            throw new ErrorWithStatusCode(err.status, err.message, err.error);
        });
    };

    return getData().then(addToDatabase).catch((err) => {
        let options = {
            status: err.status ? err.status : 500,
            message: err.message ? err.message : 'Sorry, we are facing some issue right now.',
            data: err
        };
        const headers = [{name: 'Content-Type', value: 'application/json'}];
        return responseHandler(res, options, headers);
    });
}

export function removeOnePost(req, res) {
    let query = {
        url: req.params.url
    };

    return mongo.removeOne('posts', query).then((data) => {
        let options = {
            status: data.status,
            message: data.message,
            data: data.data
        };
        const headers = [{name: 'Content-Type', value: 'text/html'}];
        return responseHandler(res, options, headers);
    }).catch((err) => {
        let options = {
            status: err.status ? err.status : 500,
            message: err.message ? err.message : 'Sorry, we are facing some issue right now.',
            data: err
        };
        const headers = [{name: 'Content-Type', value: 'application/json'}];
        return responseHandler(res, options, headers);
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
            data: createdComment
        };

        const headers = [{name: 'Content-Type', value: 'application/json'}];
        return responseHandler(res, options, headers);
    };

    return getRequestBody().then(findPost).then(createComment).then(updatePostWithComment).then(sendResponse).catch((err)=>{
        let options = {
            status: err.status ? err.status : 500,
            message: err.message ? err.message : 'Sorry, we are facing some issue right now.',
            data: err
        };
        const headers = [{name: 'Content-Type', value: 'application/json'}];
        return responseHandler(res, options, headers);
    });

}

export function renderNewPost(req, res){

    const getView = ()=>{
        let options = {
            content: {
                sidebar,
                meta: {
                    title: 'Ayush Bahuguna',
                    keywords: 'admin,new post,ayush bahuguna',
                    description: 'This is admin panel where Ayush bahuguna creates new post'
                }
            }
        };

        return renderView('admin/src/components/posts/new_post/new.post.ejs', options);

    };

    const sendResponse = (str)=>{
        
        let options = {
            data: str,
            status: 200,
            message: 'Serving new post template'
        };

        const headers = [{name: 'Content-Type', value: 'text/html'}];
        return responseHandler(res, options, headers);
    };

    return getView().then(sendResponse).catch((err)=>{
        
        let options = {
            status: 500,
            message: 'Sorry, we are facing some issue right now. Please, try again later.',
            data: err.error
        };

        const headers = [{name: 'Content-Type', value: 'application/json'}];
        return responseHandler(res, options, headers);

    });
}



















