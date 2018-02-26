import mongodb from '../../services/mongodb/mongodb.service';
import {SaveSubscriber, ParseSubscriber} from '../../services/layers/subscriber.layer';
import {responseHandler} from '../../handlers/response.handler';
import {ErrorWithStatusCode} from '../../handlers/errorhandler';
import {connectMongo} from '../../config/mongo.config';
import {ObjectID} from 'mongodb';
import {getReqBody} from '../../handlers/parse.request';

export function newSubscriber(req, res) {

    const saveToDB = (body)=>{
        return mongodb.insert('subscribers', body, SaveSubscriber, ParseSubscriber)
    }

    const sendResponse = ({data, status, message})=>{
        const options = {
            status,
            message,
            data
        };
        const headers = [{name: 'Content-Type', value: 'application/json'}];

        return responseHandler(res, options, headers);
    };

    return getReqBody(req).then(saveToDB).then(sendResponse).catch((err)=>{
        const options = {
            status: err.status ? err.status : 500,
            message: err.message ? err.message : 'Sorry, we are facing some issue right now. Please, try again later',
            data: err.error
        };

        const headers = [{name: 'Content-Type', value: 'application/json'}];
        return responseHandler(res, options, headers);
    })

}

export function removeSubscriber(req, res) {

    const removeFromDB = ()=>{

        const query = {
            _id: ObjectID(req.params.subscriberId)
        }

        return mongodb.removeOne('subscribers', query)
    }

    const sendReponse = ({data, message, status})=>{
        const options = {
            data,message,status
        };

        const headers = [{name: 'Content-Type', value: 'application/json'}];

        return responseHandler(res, options, headers);
    };

    return removeFromDB().then(sendReponse).catch((err)=>{
        const options = {
            status: err.status ? err.status : 500,
            message: err.message ? err.message : 'Sorry, we are facing some issue right now. Please, try again later',
            data: err.error
        };

        const headers = [{name: 'Content-Type', value: 'application/json'}];
        return responseHandler(res, options, headers);
    })

}