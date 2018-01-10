import Router from 'router';
import * as controller from './post.controllers';
import {
  authHandler
} from '../../handlers/auth.handler';

const router = new Router();

router.get('/', controller.getAllPosts);

router.post('/', authHandler, controller.addOnePost);

router.get('/:url', controller.getOnePost);

router.put('/:postId', authHandler, controller.updateOnePost);

router.delete('/:postId', authHandler, controller.removeOnePost);

export {
  router as postRouter
}