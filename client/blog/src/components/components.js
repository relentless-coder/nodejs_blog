import {comment} from './comments/comment.js';
import {singlePostHandler} from './posts/single_post/single.post.js';

export const app = ()=>{
    window.onload = ()=>{
        if(document.querySelector('.new_comment_wrapper')){
            console.log('yeee haaaawwww');
            comment().setupNewComment();
        }
        if(document.querySelector('.single_post_content')){
            singlePostHandler();
        }
    };

    window.commentWrapper= {
        new: comment().postComment,
        reply: comment().replyComment
    };

};

