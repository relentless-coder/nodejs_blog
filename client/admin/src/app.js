import {app} from './components/component.js';

const {post, profile, user} = app();

window.post = post;
window.profile = profile;
window.user = user;
