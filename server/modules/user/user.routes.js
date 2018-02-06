import Router from 'router';
import * as controller from './user.controller';
import {authHandler} from '../../handlers/auth.handler';

let router = new Router();

router.post('/signup', controller.signup);

router.get('/admin/profile', controller.renderProfile);

router.put('/', authHandler, controller.updateUser);

router.post('/signin', controller.signin);

export {router as userRouter};
