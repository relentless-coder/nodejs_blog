import http from 'http';
import Router from 'router';
import routerFactory from './modules/module';



const server = http.createServer((req, res) => {
    routerFactory(req, res, handleError);
});


function handleError(data) {
    console.log(data);
}

server.listen(5000, () => {
    console.log('Server listening on port 5000');
});
