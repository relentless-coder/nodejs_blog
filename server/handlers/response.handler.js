function responseHandler(res, options, headers) {
    if(!(Object.keys(options).length >= 3)){
        throw SyntaxError('You need to pass atleast 4 arguments');
    } else if (typeof arguments[0] !== 'object' || !arguments[0].writeHead || !arguments[0].end) {
        throw TypeError('The first argument must be an object with methods writeHead and end');
    } else {
        const localHeaders = {};
        console.log(headers);
        headers.forEach(el => localHeaders[el.name] = el.value)
        res.writeHead(options.status, localHeaders);
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
