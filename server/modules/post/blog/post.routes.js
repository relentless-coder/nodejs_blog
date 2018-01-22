import Router from 'router';
import {authHandler} from '../../../handlers/auth.handler';
import * as controller from '../post.controllers';

const router = new Router()

router.post('/', authHandler, controller.addOnePost);
