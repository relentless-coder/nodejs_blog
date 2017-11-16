import http from 'http';
import Router from 'router';
import {productRouter} from "../modules/product/product.routes";

const server = http.createServer();

const router = new Router();

router.use('/api/v1', productRouter);

function handleError(err) {
    console.log(err);
}

server.on('request', (req, res)=>{
    router(req, res, handleError)
});

server.listen(5000);