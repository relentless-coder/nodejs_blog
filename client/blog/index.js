import {comment} from './views/comments/comment';
import {singlePostHandler} from './views/posts/single_post/single.post';

singlePostHandler();
window.commentWrapper = comment();
