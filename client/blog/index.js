import {comment} from './components/comments/comment.js';
import {singlePostHandler} from './components/posts/single_post/single.post.js';

singlePostHandler();
window.commentWrapper = comment();
