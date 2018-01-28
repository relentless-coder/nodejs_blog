function responseHandler(res, options) {
    if(!(Object.keys(options).length >= 4)){
        throw SyntaxError('You need to pass atleast 4 arguments');
    } else if (typeof arguments[0] !== 'object' || !arguments[0].writeHead || !arguments[0].end) {
        throw TypeError('The first argument must be an object with methods writeHead and end');
    } else {
        res.writeHead(options.status, {'Content-Type': options.content});
        let data;
        if(typeof options.data === 'object')
            data = JSON.stringify(options.data);
        else
            data = options.data;
        res.end(data);
        return true;
    }
}

export {responseHandler};