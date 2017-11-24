import {ErrorWithStatusCode} from './errorhandler';

function responseHandler(res, status, message, data, err) {
  if(!(arguments.length >= 4)){
    throw SyntaxError('You need to pass atleast 4 arguments');
  } else if(typeof arguments[0] !== 'object'){
    throw TypeError('The first argument must be an object with methods writeHead and end');
  } else if(!arguments[0].writeHead || !arguments[0].end){
    throw TypeError('The first argument must be an object with methods writeHead and end');
  } else {

    let body = {
      status,
      message
    };

    if(err && err === true){
      body.error = data;
    } else {
      body.data = data;
    }


    res.writeHead(status, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(body));
    return data
  }
}

export {responseHandler}