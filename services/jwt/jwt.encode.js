import moment from 'moment-timezone';
import {cryptoConfig} from "../../config/crypto.config";

import {base64encode, sign} from "./crypto.helper";
import {ErrorWithStatusCode} from '../../handlers/errorhandler';

function encode(payload) {
  if(Object.keys(payload).length === 0){
    throw new ErrorWithStatusCode(422, 'Can\'t process without complete data', 'You have passed an empty object as the payload to the encode function.')
  }
  const algorithm = 'HS256';
  const header = {
    typ: 'JWT',
    algo: algorithm
  };

  let {iat, exp} = generateExp(cryptoConfig.jwtValid);

  payload.iat = iat;
  payload.exp = exp;

  let jwt = `${base64encode(JSON.stringify(header))}.${base64encode(JSON.stringify(payload))}.`;

  jwt += sign(jwt, cryptoConfig.secret);
  return jwt;
}

function generateExp(validity) {
  let iat = moment.tz('GMT').format('x');
  let exp;

  if(parseInt(validity).toString().length === validity.length - 1){ //first we need to check if the value is pure numeric

    let validInput = validity.split('');

    let validUnit = validInput.splice(-1, 1); //extracting out the the letter from the end

    console.log(validUnit);

    switch (validUnit[0]) {
      case 'd':
        exp = parseInt(validInput.join('')) * 24 * 60 * 60 * 1000;
        break;
      case 'h':
        exp = parseInt(validInput.join('')) * 60 * 60 * 1000;
        break;
      case 'm':
        exp = parseInt(validInput.join('')) * 60 * 1000;
        break;
      default:
        exp = parseInt(validInput.join('')) * 1000;
    }
  } else {
    exp = parseInt(validity)*1000;
  }

  exp += parseInt(iat);

  return {
    iat, exp
  }
}

export {encode, generateExp}