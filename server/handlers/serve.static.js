import url from 'url';
import path from 'path';
import fs from 'fs';

function serveStatic(req, res) {
  const parsedUrl = url.parse(req.url);
  const ext = path.parse(parsedUrl.pathname).ext;
  let pathname = `./client${parsedUrl.pathname}`;
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
    } else {
      const data = fs.readFileSync(pathname);
      res.status = 200;
      res.setHeader('Content-type', map[ext] || 'text/plain');
      res.end(data);

    }
  }
}

export {serveStatic}