import Router from 'router';
import * as controller from './contact.controller';
const router = new Router();

router.get('/', controller.renderContact);
router.post('/', controller.postContact);

export {router as contactRouter}