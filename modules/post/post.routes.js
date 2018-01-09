import Router from 'router';
import * as controller from './post.controllers';
import {
	authHandler
} from '../../handlers/auth.handler';

const router = new Router();

router.get( '/posts', controller.getAllposts );

router.post( '/posts', authHandler, controller.addOnePost );

router.get( '/posts/:postId', controller.getOnePost );

router.put( '/posts/:postId', authHandler, controller.updateOnePost );

router.delete( '/posts/:postId', authHandler, controller.removeOnePost );

export {
	router as productRouter
}