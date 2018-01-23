export const authHandler = (()=>{
	let localToken;

	const setToken = ({token})=>{
		localToken = token;
		window.localStorage.token = localToken;
	};

	const getToken = ()=>{
		if(!localToken)
			localToken = window.localStorage.token;
		return localToken;
	};

	const deleteToken = ()=>{
		localToken = '';
		delete window.localStorage.token;
	};

	return {
		getToken, setToken, deleteToken
	};
})();
