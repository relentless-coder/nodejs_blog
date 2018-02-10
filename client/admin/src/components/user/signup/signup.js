import {apiHandler} from '../../../handlers/api.handler';

export const signupHandler = ()=>{
    const signup = ()=>{
        const data = {
            email: document.getElementById('signup_email').value,
            password: document.getElementById('signup_password').value
        }

        const options = {
            method: 'post',
            data,
            url: '/user/signup',
            setConfig: false
        }

        const goToLogin = ()=>{
            window.location.pathname = '/user/admin/signin'
        }

        return apiHandler.callAPi(options).then(goToLogin).catch((err)=>{
            console.log(err)
        })
    }

    return {signup}
}