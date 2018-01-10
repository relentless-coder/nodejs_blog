import http from 'http';
import router from './modules/module'

const server = http.createServer((req, res) => {
  router(req, res, handleError)
});


function handleError(data) {

}

server.listen(5000, () => {
  console.log('Server listening on port 5000')
});