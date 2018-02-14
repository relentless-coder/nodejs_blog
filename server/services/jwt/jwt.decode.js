import {base64decode, sign} from './crypto.helper';
import {cryptoConfig} from '../../config/crypto.config';
import {ErrorWithStatusCode} from '../../handlers/errorhandler';

function decode(req) {
    if(!req.headers.cookie){
        throw new ErrorWithStatusCode(403, 'Access not allowed', 'There was no authorization header found. The format is: "Authorization: Bearer [token]"');
    } else {
        const token = req.headers.cookie.split('authorization=')[1];
        const segments = token.split('.');
        if (segments.length !== 3) {
            throw new ErrorWithStatusCode(400, 'Invalid token format', 'The token found didn\'t match up to the standard jwt format.');
        }
        const header = segments[0];
        const payload = segments[1];
        const tokenSign = segments[2];
        const signature = `${header}.${payload}.`;
        let jwt = sign(signature, cryptoConfig.secret);
        if (jwt === tokenSign) {
            return JSON.parse(base64decode(segments[1]));
        } else {
            throw new ErrorWithStatusCode(401, 'Unauthorized access', 'Token signature didn\'t match.');
        }
    }
}

export {decode};