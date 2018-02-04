import Router from 'router';
import * as controller from './user.controller';

let router = new Router();

router.post('/signup', controller.signup);

router.get('/admin/profile', controller.renderProfile);

router.put('/', controller.updateUser);

router.post('/signin', controller.signin);

export {router as userRouter};
