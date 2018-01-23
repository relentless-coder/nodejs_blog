import crypto from 'crypto';
import {cryptoConfig} from '../../config/crypto.config';

function base64encode(str) {
	return new Buffer(str).toString('base64');
}

function base64decode(str) {
	return new Buffer(str, 'base64').toString();
}

function sign(str) {
	return crypto.createHmac(cryptoConfig.digest, cryptoConfig.secret).update(str).digest('base64');
}

export {base64decode, base64encode, sign};