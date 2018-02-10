import Router from 'router';
import * as controller from './user.controller';
import {authHandler} from '../../handlers/auth.handler';

let router = new Router();

router.post('/signup', controller.signup);

router.get('/admin/profile', authHandler, controller.renderProfile);

router.get('/admin/signin', controller.renderSignin)
router.get('/admin/signup', controller.renderSignup)

router.put('/', authHandler, controller.updateUser);

router.post('/signin', controller.signin);

export {router as userRouter};
