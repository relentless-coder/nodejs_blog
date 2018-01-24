import {editPostHandler} from './posts/edit_post/edit.post.js';
import {newPostHandler} from './posts/new_post/new.post.js';

const post = {
	edit: editPostHandler().editPost,
	new: newPostHandler().createNewPost
};
