import * as controller from './product.controllers';

function routes(router) {
    return {
        getAll: router.get('/products', controller.getAllProducts),
        getOne: router.get('/products/:productId', controller.getOneProduct)
    }
}