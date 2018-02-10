export const authHandler = (()=>{
    let localToken;

    const setToken = ({data})=>{
        console.log("token is", data)
        localToken = data.token;
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
