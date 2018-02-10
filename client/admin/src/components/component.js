import {editPostHandler} from './posts/edit_post/edit.post.js';
import {newPostHandler} from './posts/new_post/new.post.js';
import {profileHandler} from './user/update/user';
import {signinHandler} from './user/signin/signin';
import {signupHandler} from './user/signup/signup';

export const app = ()=>{

    window.onload = ()=>{
        if(document.querySelector('#new_post')){
            newPostHandler().setupNewPost();
        } else if(document.querySelector('#edit_post')){
            editPostHandler().setupEditPost();
        } else if(document.querySelector('.about_you')){
            profileHandler().setupUpdateProfile();
        }
    };

    const post = {
        edit: editPostHandler().editPost,
        new: newPostHandler().createNewPost
    };

    const user = {
        signin: signinHandler().signin,
        signup: signupHandler().signup
    }

    const profile = {
        addSocialProfile: profileHandler().addSocialProfile,
        setupUpdateProfile: profileHandler().setupUpdateProfile,
        updateProfile: profileHandler().updateProfile
    };


    return {post, profile, user};
};
