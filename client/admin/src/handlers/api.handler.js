import axios from 'axios';
import {authHandler} from './auth.handler.js';

export const apiHandler = (() => {
    const setConfig = () => {
        return {'Authorization': `Bearer ${authHandler.getToken()}`};
    };

    const callAPi = ({method, url, data, config}) => {
        let localConfig;
        if (config) {
            localConfig = setConfig();
        }
        if (data) {
            console.log("localConfig is ", localConfig)
            return axios({
                method,
                url,
                data,
                headers: localConfig
            });
        } else {
            return axios({
                method,
                url,
                localConfig
            });
        }


    };

    return {callAPi};

})();
