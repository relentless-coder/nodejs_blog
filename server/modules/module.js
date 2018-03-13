import Router from 'router';
import {userRouter} from './user/user.routes';
import {postRouter} from './post/post.routes';
import {serveStatic} from '../handlers/serve.static';
import {renderView} from '../handlers/render.view.js';
import {responseHandler} from '../handlers/response.handler.js';
import mongodb from '../services/mongodb/mongodb.service';
import {getUser} from '../services/layers/user.layer';
import {subsciberRouter} from './subscriber/subscriber.routes';
import {getPost} from '../services/layers/post.layer';
import {contactRouter} from './contact/contact.routes';

const router = new Router();

function routerFactory() {

    router.use('/post', postRouter);
    router.use('/user', userRouter);
    router.use('/subscribe', subsciberRouter);
    router.use('/contact', contactRouter);

    router.get('/', (req, res)=>{
        let user, posts;
        const findUser = ()=>{
            return mongodb.findAll('users', {}, getUser)
        };
        const findPosts = ({data})=>{
            user = data[0];
            return mongodb.findAll('posts', {}, getPost)
        };
        const setupRender = ({data})=>{
            posts = data.splice(0, 5);
            user.social = JSON.parse(user.social);
            user.projects = JSON.parse(user.projects);
            const options = {
                content: {
                    user,
                    posts,
                    meta: {
                        title: 'Ayush Bahuguna | Fullstack Developer',
                        keywords: 'ayush bahuguna,fullstack developer new delhi,javascript developer new delhi,fullstack development tutorials,nodejs tutorials,mongodb tutorials,aws tutorials,freelance developer new delhi',
                        description: 'Official page of Ayush Bahuguna, who is working as fullstack developer in New Delhi, and is looking forward to exciting freelance opportunities. This website also provides helpful tutorials that may help fellow developers at work.'
                    }
                }
            };
            return  renderView('blog/src/components/home/home.ejs', options)
        };
        findUser().then(findPosts).then(setupRender).then((str)=>{
            let options = {
                status: 200,
                message: 'Success',
                data: str,
            };
            const headers = [{name: 'Content-Type', value: 'text/html'}];
            return responseHandler(res, options, headers);
        }).catch((err)=>{
            console.log(err);
            let options = {
                status: err.status ? err.status : 500,
                message: err.message ? err.message : 'Sorry, we are facing some issue right now. Please, try again later.',
                data: 'We are facing some issue.'
            };
            const headers = [{name: 'Content-Type', value: 'text/plain'}];

            return responseHandler(res, options, headers);
        });
    });

    router.get('*', serveStatic);

    return router;
}

export default routerFactory();
