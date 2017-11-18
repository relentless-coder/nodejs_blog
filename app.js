import http from 'http';
import Router from 'router';
import {productRouter} from "./modules/product/product.routes";
import {userRouter} from "./modules/user/user.routes";

const router = new Router();

router.use('/api/v1', productRouter);

router.use('/api/v1', userRouter);

const server = http.createServer((req, res)=>{
    router(req, res, handleError)
});


function handleError(data) {
    console.log("data is ", data);
}

server.listen(5000, ()=>{
    console.log('Server listening on port 5000')
});