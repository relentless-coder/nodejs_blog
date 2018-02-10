import {apiHandler} from '../../../handlers/api.handler';
import {authHandler} from '../../../handlers/auth.handler';

export const signinHandler = ()=>{

    const signin = ()=>{
        const data = {
            userEmail: document.getElementById('signin_email').value,
            userPassword: document.getElementById('signin_password').value
        }

        const options = {
            method: 'post',
            data,
            url: '/user/signin',
            setConfig: false
        }

        const goToProfile = ()=>{
            window.location.pathname = '/user/admin/profile'
        }

        return apiHandler.callAPi(options).then(authHandler.setToken).then(goToProfile).catch((err)=>{
            console.log(err)
        })
    }

    return {signin}
}