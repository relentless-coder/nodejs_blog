import crypto from 'crypto';
import {cryptoConfig} from "../../config/crypto.config";

import {base64encode, sign} from "./crypto.helper";

function encode(payload) {
  const algorithm = 'HS256';
  const header = {
    typ: 'JWT',
    algo: algorithm
  };

  let jwt = `${base64encode(JSON.stringify(header))}.${base64encode(JSON.stringify(payload))}.`;

  jwt += sign(jwt, cryptoConfig.secret);
  return jwt;
}

export {encode}