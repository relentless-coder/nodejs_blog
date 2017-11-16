import * as controller from './product.controllers';
import Router from 'router';

const router = new Router();

console.log(typeof  controller.getAllProducts);
console.log(controller.getAllProducts);

router.get('/products', controller.getAllProducts);

router.post('/products', controller.addOneProduct);

router.get('/products/:productId', controller.getOneProduct);

router.put('/products/:productId', controller.updateOneProduct)


export {router as productRouter}



