import Router from 'router';
import {userRouter} from './user/user.routes';
import {postRouter} from './post/post.routes';
import {serveStatic} from '../handlers/serve.static';

const router = new Router();

function routerFactory() {

	router.use('/post', postRouter);
	router.use('/user', userRouter);

	router.get('*', serveStatic);

	return router;
}

export default routerFactory();