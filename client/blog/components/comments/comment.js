import commentFactory from './comment.factory';
import {DOMParser} from 'prosemirror-model';
import {schema} from 'prosemirror-schema-basic';
import {EditorState} from 'prosemirror-state';

function comment() {

    let content = document.getElementById('new_comment');

    let state = EditorState.create({
        doc: DOMParser.fromSchema(schema).parse(content)
    });

    const postComment = (url) => {
        const data = {
            author: {
                name: document.getElementById('comment_name').value,
                email: document.getElementById('comment_email').value
            },
            comment: document.getElementById('author_new_comment').value
        };
        commentFactory.postComment(data, url).then((data)=>{
            const commentWrapper = document.querySelector('.comment_wrapper');
            const result = Handlebars.templates['comment'](data.data);
            console.log(result);
            commentWrapper.insertAdjacentHTML('beforeend', result);
        });
    };

    const replyComment = (comment, id) => {
        commentFactory.replyComment(comment, id);
    };

    return {
        postComment, replyComment
    };
}

export {comment};

