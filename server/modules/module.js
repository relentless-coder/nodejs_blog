import Router from 'router';
import {userRouter} from './user/user.routes';
import {postRouter} from './post/post.routes';
import {serveStatic} from '../handlers/serve.static';
import {renderView} from '../handlers/render.view.js';
import {responseHandler} from '../handlers/response.handler.js';

const router = new Router();

function routerFactory() {

    router.use('/post', postRouter);
    router.use('/user', userRouter);

    const options = {
        content: {
            meta: {
                title: 'Ayush Bahuguna | Fullstack Developer',
                description: `Ayush Bahuguna is a fullstack javascript developer, from New Delhi India.
                He understands the startup culture, and so if you are a startup or an individual,
                who wants to bring their idea to life, then Ayush Bahuguna can help you achieve you goal,
                in the most efficient way possible.
                `,
                keywords: 'ayush bahuguna,fullstack javascript developer,freelance javascript developer,freelance web developer,freelance javascript developer in india,freelance web developer in india,freelance javascript developer New Delhi,freelance web developer New Delhi',
                image: '../../client/blog/build/images/ayush.jpg'
            }
        }
    };

    router.get('/', (req, res)=>{
        return  renderView('blog/src/components/home/home.ejs', options).then((str)=>{
            let options = {
                status: 200,
                message: 'Success',
                data: str,
                content: 'text/html'
            };
            return responseHandler(res, options);
        }).catch((err)=>{
            console.log(err);
            let options = {
                status: err.status ? err.status : 500,
                message: err.message ? err.message : 'Sorry, we are facing some issue right now. Please, try again later.',
                data: 'We are facing some issue.',
                content: 'text/plain'
            };
            return responseHandler(res, options);
        });
    });

    router.get('*', serveStatic);

    return router;
}

export default routerFactory();
