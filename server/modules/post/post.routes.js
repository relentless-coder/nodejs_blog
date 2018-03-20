import Router from 'router';
import * as controller from './post.controllers';
import {
    authHandler
} from '../../handlers/auth.handler';

const router = new Router();

router.get('/', controller.getAllPosts);
router.post('/', authHandler, controller.addOnePost);

router.get('/admin/new', authHandler, controller.renderNewPost);
router.get('/admin/all', authHandler, controller.renderAdminPosts);
router.get('/admin/:postId', authHandler, controller.renderEditPost);

router.get('/:url', controller.getOnePost);

router.put('/:postId', authHandler, controller.updateOnePost);

router.delete('/:postId', authHandler, controller.removeOnePost);

router.post('/:postId/comment', controller.addOneComment);

router.post('/:postId/comment/:commentId', controller.replyComment);

export {
    router as postRouter
};
