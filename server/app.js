import http from 'http';
import router from './modules/module'

router.get('*', (req, res) => {

  const parsedUrl = url.parse(req.url);
  const ext = path.parse(parsedUrl.pathname).ext;
  let pathname = `.${parsedUrl.pathname}`;
  const map = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
  };

  if(ext === '.css' || ext === '.js') {
    let exist = fs.existsSync(pathname);
    if (!exist) {
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      console.log(exist);
    } else {
      const data = fs.readFileSync(pathname);
      res.status = 200;
      res.setHeader('Content-type', map[ext] || 'text/plain');
      res.end(data);
    }
  }
})

const server = http.createServer((req, res) => {
  router(req, res, handleError)
});


function handleError(data) {

}

server.listen(5000, () => {
  console.log('Server listening on port 5000')
});