import url from 'url';
import path from 'path';
import fs from 'fs';

export const serveStatic = (req, res)=> {
    const parsedUrl = url.parse(req.url);
    const ext = path.parse(parsedUrl.pathname).ext;
    let pathnameBlog = `./client/blog${parsedUrl.pathname}`;
    let pathnameAdmin = `./client/admin${parsedUrl.pathname}`;
    const map = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
    };

    if(ext === '.css' || ext === '.js') {
        let existInAdmin = fs.existsSync(pathnameAdmin);
        let existInBlog = fs.existsSync(pathnameBlog);
        if (!existInAdmin && !existInBlog) {
            res.statusCode = 404;
            res.end('File not found!');
        } else if(existInAdmin) {
            const data = fs.readFileSync(pathnameAdmin);
            res.status = 200;
            res.setHeader('Content-type', map[ext] || 'text/plain');
            res.end(data);
        } else {
            const data = fs.readFileSync(pathnameBlog);
            res.status = 200;
            res.setHeader('Content-type', map[ext] || 'text/plain');
            res.end(data);
        }
    }
};
