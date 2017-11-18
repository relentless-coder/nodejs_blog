import {base64decode, sign} from "./crypto.helper";
import {cryptoConfig} from "../../config/crypto.config";

function decode(req) {
  if(!req.headers.authorization){
    throw new Error('No token found')
  } else {
    const token = req.headers.authorization.split(' ')[1];
    const segments = token.split('.')
    if (segments.length !== 3) {
      throw new Error('Invalid token');
    }
    const header = segments[0];
    const payload = segments[1];
    const tokenSign = segments[2];
    const signature = `${header}.${payload}.`;
    let jwt = sign(signature, cryptoConfig.secret);
    if (jwt === tokenSign) {
      return JSON.parse(base64decode(segments[1]))
    } else {
      throw new Error('Invalid token');
    }
  }
}

export {decode}