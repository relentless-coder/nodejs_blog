import Router from 'router'
import * as controller from './subscriber.controller';

const router = new Router();

router.post('/', controller.newSubscriber);
router.delete('/', controller.removeSubscriber);

export {router as subsciberRouter}