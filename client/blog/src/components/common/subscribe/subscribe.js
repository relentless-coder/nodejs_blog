import axios from 'axios';

export const subscribeHandler = ()=>{

    const submitSubscribe = ()=>{

        const data = {
            name: document.getElementById('subscriber_name').value,
            email: document.getElementById('subscriber_email').value
        };

        return axios.post('/subscribe', data).then(({data})=> console.log(data)).catch((err)=>console.log(err))
    }

    return {submitSubscribe}
}