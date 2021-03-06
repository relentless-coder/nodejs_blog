import commentFactory from './comment.factory';
import {setupMenu, schema} from '../editor/menu.items.js';
import {DOMParser} from 'prosemirror-model';
import {EditorView} from 'prosemirror-view';
import {EditorState} from 'prosemirror-state';
import {baseKeymap} from 'prosemirror-commands';
import {keymap} from 'prosemirror-keymap';
import {commentTemp} from '../../templates/comment_temp';
import {replyTemp} from '../../templates/reply_temp';

const renderView = (path, data) => {
    console.log("path is ", path);
    return new Promise((resolve, reject) => {
        ejs.render(path, data, (err, str) => {
            if (err) {
                console.log("error is ", err);
                reject(err);
            } else
                resolve(str);
        });
    });
};

function comment() {

    let content = document.getElementById('new_comment');


    const setupNewComment = () => {

        window.view = new EditorView(document.querySelector('#editor'), {
            state: EditorState.create({
                doc: DOMParser.fromSchema(schema).parse(content),
                plugins: [keymap(baseKeymap), setupMenu()]
            })
        });

    };
    const postComment = (url) => {
        console.log(window.view.dom.innerHTML);
        const data = {
            author: {
                name: document.getElementById('comment_name').value,
                email: document.getElementById('comment_email').value
            },
            comment: window.view.dom.innerHTML
        };
        commentFactory.postComment(data, url).then(({data}) => {
            const commentWrapper = document.querySelector('.comment_wrapper');

            const result = ejs.render(commentTemp(), {comment: data});

            commentWrapper.insertAdjacentHTML('beforeend', result);
        });
    };

    const replyComment = (commentId, postId) => {
        const body = {
            author: {
                name: document.getElementById(`${commentId}_reply_name`).value,
                email: document.getElementById(`${commentId}_reply_email`).value
            },
            comment: document.getElementById(`${commentId}_reply_comment`).value
        };
        commentFactory.replyComment(body, postId, commentId).then(({data})=>{
            console.log("data is ", data);
            const commentWrapper = document.getElementById(`${commentId}_reply_wrapper`);

            const result = ejs.render(replyTemp(), {comment: data});

            commentWrapper.insertAdjacentHTML('beforebegin', result);
        });
    };

    return {
        postComment, replyComment, setupNewComment
    };
}

export {comment};

