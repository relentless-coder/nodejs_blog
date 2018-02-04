import {editPostHandler} from './posts/edit_post/edit.post.js';
import {newPostHandler} from './posts/new_post/new.post.js';
import {profileHandler} from './user/user';

export const app = ()=>{

    window.onload = ()=>{
        if(document.querySelector('#new_post')){
            newPostHandler().setupNewPost();
        } else if(document.querySelector('#edit_post')){
            editPostHandler().setupEditPost();
        }
    };

    const post = {
        edit: editPostHandler().editPost,
        new: newPostHandler().createNewPost
    };

    const profile = {
        addSocialProfile: profileHandler().addSocialProfile,
        setupUpdateProfile: profileHandler().setupUpdateProfile,
        updateProfile: profileHandler().updateProfile
    }

    return {post, profile};
};
