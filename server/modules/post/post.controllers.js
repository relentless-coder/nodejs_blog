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
import {getReqBody} from '../../handlers/parse.request';

const sanitizeOpt = {
    allowedTags: ['img', 'p', 'pre', 'code', 'strong', 'em', 'a'],
    allowedAttributes: {
        'a': [ 'href', 'title']
          
    },
    allowedSchemes: ['data', 'http', 'https']
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
        return renderView('blog/src/components/posts/all_posts/all.post.ejs', {
            content: {
                post: data.data,
                meta: {
                    title: 'Posts | Ayush Bahuguna',
                    description: 'Here you can find tutorials on web development topics that are much more relevant to your professional career',
                    keywords: 'nodejs tutorials, mongodb tutorials, javascript tutorials'
                }
            }
        }).then((str) => {
            const options = {
                status: data.status,
                message: data.message,
                data: str
            };
            const headers = [{name: 'Content-Type', value: 'text/html'}];
            return responseHandler(res, options, headers);
        });

    }).catch((err) => {
        return responseHandler(res, {status: err.status, message: err.message, data: err.error}, [{
            name: 'Content-Type',
            value: 'application/json'
        }]);
    });
}

export function renderAdminPosts(req, res) {
    let query = {};

    return mongo.findAll('posts', query, getPost).then((data) => {
        return renderView('admin/src/components/posts/all_posts/all.post.ejs', {
            content: {
                post: data.data,
                sidebar
            }
        }).then((str) => {
            const options = {
                status: data.status,
                message: data.message,
                data: str
            };
            const headers = [{name: 'Content-Type', value: 'text/html'}];
            return responseHandler(res, options, headers);
        });

    }).catch((err) => {
        return responseHandler(res, {status: err.status, message: err.message, data: err.error}, [{
            name: 'Content-Type',
            value: 'application/json'
        }]);
    });
}

export function getOnePost(req, res) {
    let query = {
        'url': req.params.url
    };
    return mongo.findSingle('posts', query, getPost).then((data) => {
        renderView('blog/src/components/posts/single_post/single.post.ejs', {
            content: {
                post: data.data,
                meta: data.data.meta
            }
        })
            .then((clientData) => {
                let options = {
                    status: data.status,
                    message: data.message,
                    data: clientData
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
    });
}

export function addOnePost(req, res) {

    const addToDatabase = (data) => {
        req.body = data;
        req.body.url = req.body.title.toLowerCase().split(' ').join('-');
        console.log(req.body.content);
        req.body.content = sanitize(req.body.content, sanitizeOpt);
        console.log(req.body.content);
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

    return getReqBody(req).then(addToDatabase).catch((err) => {
        console.log('error is ', err);
        let options = {
            status: err.status ? err.status : 500,
            message: err.message ? err.message : 'Sorry, we are facing some issue right now.',
            data: err
        };
        const headers = [{name: 'Content-Type', value: 'application/json'}];
        return responseHandler(res, options, headers);
    });
}

export async function updateOnePost(req, res) {

    try {

        const body = await getReqBody(req);

        const query = {
            _id: ObjectID(req.params.postId)
        };

        const pData = await mongo.findSingle('posts', query, getPost);
        

        const post = pData.data;

        for(let key in body){
            post[key] = body[key];
        }

        post._id = ObjectID(req.params.postId);

        const data = await mongo.update('posts', query, post, updatePost, getPost);

        let options = {
            status: data.status,
            message: data.message,
            data: data.data
        };

        const headers = [{name: 'Content-Type', value: 'text/html'}];

        return responseHandler(res, options, headers);

    } catch (err){
        console.log(err);
        let options = {
            status: err.status ? err.status : 500,
            message: err.message ? err.message : 'Sorry, we are facing some issue right now.',
            data: err
        };
        const headers = [{name: 'Content-Type', value: 'text/plain'}];
        return responseHandler(res, options, headers);
    }

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

    const getRequestBody = () => {
        const body = [];
        return new Promise((resolve, reject) => {
            req.on('error', err => reject(err)).on('data', (data) => {
                body.push(data);
            }).on('end', () => {
                resolve(JSON.parse(Buffer.concat(body).toString()));
            });
        });
    };

    const findPost = (body) => {
        req.body = body;
        req.body.comment = sanitize(req.body.comment, sanitizeOpt);
        const query = {
            _id: ObjectID(req.params.postId)
        };

        return mongo.findSingle('posts', query, getPost);
    };

    const createComment = (data) => {
        foundPost = data.data;

        return mongo.insert('comments', req.body, addComment, getComment);
    };

    const updatePostWithComment = (data) => {
        createdComment = data.data;
        foundPost.comments.push(createdComment);

        const query = {
            _id: ObjectID(req.params.postId)
        };

        return mongo.update('posts', query, foundPost, updatePost, getPost);
    };

    const sendResponse = (data) => {
        let options = {
            status: data.status,
            message: 'Comment posted successfully',
            data: createdComment
        };

        const headers = [{name: 'Content-Type', value: 'application/json'}];
        return responseHandler(res, options, headers);
    };

    return getRequestBody().then(findPost).then(createComment).then(updatePostWithComment).then(sendResponse).catch((err) => {
        console.log('err is ', err);
        let options = {
            status: err.status ? err.status : 500,
            message: err.message ? err.message : 'Sorry, we are facing some issue right now.',
            data: err
        };
        const headers = [{name: 'Content-Type', value: 'application/json'}];
        return responseHandler(res, options, headers);
    });
}

export function replyComment(req, res) {
    let foundPost, foundComment, createdReply;

    const findPost = (body)=>{
        req.body = body;
        const query = {
            _id: ObjectID(req.params.postId)
        };
        return mongo.findSingle('posts', query, getPost);
    };
    const findComment = ({data}) => {
        foundPost = data;
        const query = {
            _id: ObjectID(req.params.commentId)
        };

        return mongo.findSingle('comments', query, getComment);
    };

    const addReply = ({data}) => {
        foundComment = data;
        req.body.comment = sanitize(req.body.comment, sanitizeOpt);
        return mongo.insert('comments', req.body, addComment, getComment);
    };

    const updateCommentWithReply = ({data}) => {
        createdReply = data;
        foundComment.comments.push(createdReply);
        const query = {
            _id: ObjectID(req.params.commentId)
        };
        return mongo.update('comments', query, foundComment, getComment, getComment);
    };

    const updatePostWithComments = ()=>{

        const query = {
            _id: ObjectID(req.params.postId)
        };

        foundPost.comments.forEach((el, i)=>{
            if(el._id.toString() === foundComment._id.toString()){
                foundPost.comments[i] = foundComment;
            }
        });


        return mongo.update('posts', query, foundPost, updatePost, getPost);
    };

    const sendResponse = () => {
        const options = {
            status: 200,
            data: createdReply,
            message: 'Reply posted'
        };

        const headers = [{name: 'Content-Type', value: 'application/json'}];

        return responseHandler(res, options, headers);
    };

    return getReqBody(req).then(findPost).then(findComment).then(addReply).then(updateCommentWithReply).then(updatePostWithComments).then(sendResponse).catch((err) => {
        console.log('err is ', err);
        const options = {
            status: err.status ? err.status : 500,
            data: err.error ? err.error : 'Internal server error',
            message: 'Sorry, we are facing some issue right now. Please, try again later'
        };
        const headers = [{name: 'Content-Type', value: 'application/json'}];
        return responseHandler(res, options, headers);
    });
}

export function renderNewPost(req, res) {

    const getView = () => {
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

    const sendResponse = (str) => {

        let options = {
            data: str,
            status: 200,
            message: 'Serving new post template'
        };

        const headers = [{name: 'Content-Type', value: 'text/html'}];
        return responseHandler(res, options, headers);
    };

    return getView().then(sendResponse).catch((err) => {

        let options = {
            status: 500,
            message: 'Sorry, we are facing some issue right now. Please, try again later.',
            data: err.error
        };

        const headers = [{name: 'Content-Type', value: 'application/json'}];
        return responseHandler(res, options, headers);

    });
}

export function renderEditPost (req, res){
    const findPost = ()=>{
        const query = {
            _id: ObjectID(req.params.postId)
        };
        
        return mongo.findSingle('posts', query, getPost);
    };

    const getView = ({data}) => {
        let options = {
            content: {
                sidebar,
                post: data,
                meta: {
                    title: 'Ayush Bahuguna',
                    keywords: 'admin,new post,ayush bahuguna',
                    description: 'This is admin panel where Ayush bahuguna creates new post'
                }
            }
        };

        return renderView('admin/src/components/posts/edit_post/edit.post.ejs', options);

    };

    const sendResponse = (str) => {

        let options = {
            data: str,
            status: 200,
            message: 'Serving new post template'
        };

        const headers = [{name: 'Content-Type', value: 'text/html'}];
        return responseHandler(res, options, headers);
    };

    return findPost().then(getView).then(sendResponse).catch((err) => {
        console.log(err);
        let options = {
            status: 500,
            message: 'Sorry, we are facing some issue right now. Please, try again later.',
            data: err.error
        };

        const headers = [{name: 'Content-Type', value: 'plain/text'}];
        return responseHandler(res, options, headers);

    });

}
