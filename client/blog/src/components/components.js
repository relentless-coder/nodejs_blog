import {comment} from './comments/comment.js';
import {singlePostHandler} from './posts/single_post/single.post.js';
import {subscribeHandler} from './common/subscribe/subscribe';

export const app = ()=>{
    window.onload = ()=>{
        if(document.querySelector('.new_comment_wrapper')){
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

    window.subscribe = subscribeHandler()

};

