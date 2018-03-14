import axios from 'axios';

export const contactHandler = ()=>{
    const sendMessage = ()=>{
        const data = {
            email: document.getElementById('contactEmail').value,
            name: document.getElementById('contactName').value,
            message: document.getElementById('contactMessage').value
        };

        return axios.post('/contact', data).then((data)=>{
            document.getElementById('contactEmail').value = '';
            document.getElementById('contactName').value = '';
            document.getElementById('contactMessage').value = '';
            alert('Sorry, for the lazy alert, but your message has been submitted. I\'ll get back to you soon.')
        })
    };

    return {
        sendMessage
    }
};