import Router from 'router';
import * as controller from './user.controller';

let router = new Router();

router.post('/signup', controller.signup);

router.post('/signin', controller.signin);

router.get('/', );

export {router as userRouter};