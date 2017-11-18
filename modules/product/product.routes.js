import * as controller from './product.controllers';
import Router from 'router';
import {authHandler} from "../../handlers/auth.handler";

const router = new Router();

router.use(authHandler)

router.get('/products', controller.getAllProducts);

router.post('/products', controller.addOneProduct);

router.get('/products/:productId', controller.getOneProduct);

router.put('/products/:productId', controller.updateOneProduct);

router.delete('/products/:productId', controller.removeOneProduct);

export {router as productRouter}



