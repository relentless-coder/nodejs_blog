import * as controller from './product.controllers';
import Router from 'router';

const router = new Router();

router.get('/products', controller.getAllProducts);

router.get('/products/:productId', controller.getOneProduct);

router.post('/products', controller.addProduct);


export {router as productRouter}



