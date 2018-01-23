import axios from 'axios';
import {authHandler} from './auth.handler.js';

export const apiHandler = (()=>{
	const setConfig = ()=>{
		return {'headers': {'Authorization': `Bearer ${authHandler.setToken()}`}};
	};

	const callAPi = ({method, url, data, config})=>{
		let localConfig;
		if(config)
			localConfig = setConfig();
		if(data)
			return axios({
				method,
				url,
				data,
				localConfig
			});
		
		return axios({
			method,
			url,
			localConfig
		});
	};

	return {callAPi};

})();
