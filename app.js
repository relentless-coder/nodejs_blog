import http from 'http';
import Router from 'router';
import {productRouter} from "./modules/product/product.routes";

const router = new Router();

router.use('/api/v1', productRouter);


const server = http.createServer((req, res)=>{
    router(req, res, handleError)
});


function handleError(data) {
    console.log("data is ", data);
}

server.listen(5000, ()=>{
    console.log('Server listening on port 5000')
});