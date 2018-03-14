import mongodb from '../../services/mongodb/mongodb.service';
import {renderView} from '../../handlers/render.view';
import {responseHandler} from '../../handlers/response.handler';
import {transport} from '../../config/mailer.config';
import {getReqBody} from '../../handlers/parse.request';

export function renderContact(req, res) {
    return renderView('blog/src/components/contact/contact.ejs', {content: {meta: {title: 'Contact | Ayush Bahuguna', description: 'Here you can find tutorials on web development topics that are much more relevant to your professional career', keywords: 'nodejs tutorials, mongodb tutorials, javascript tutorials'}}}).then((str) => {
        let options = {
            status: 200,
            data: str,
            message: 'Success'
        };

        const headers = [{name: 'Content-Type', value: 'text/html'}];


        return responseHandler(res, options, headers);
    }).catch((err) => {
        console.log(err)
        let options = {
            status: 500,
            data: 'Sorry, we are facing some issue right now. Please, try again later.',
            message: 'Sorry, we are facing some issue right now. Please, try again later.'
        };

        const headers = [{name: 'Content-Type', value:  'text/plain'}];

        return responseHandler(res, options, headers);
    });
}

export function postContact(req, res) {
    const sendMessage = (data)=>{
        const options = {
            from: `"${data.name}"<${data.email}>`,
            to: 'contact@ayushbahuguna.com',
            subject: `New Message: ${data.name}`,
            replyTo: data.email,
            text: data.message
        };
        transport.sendMail(options, (err, done)=>{
            console.log('done');
        });

        const response = {
            status: 200,
            data: 'Email sent',
            message: 'Email sent'
        };

        const headers = [{name: 'Content-Type', value: 'application/json'}];

        return responseHandler(res, response, headers);
    };

    return getReqBody(req).then(sendMessage).catch((err)=>{
        const response = {
            status: 500,
            data: err,
            message: 'Sorry, we are facing an error.'
        };

        const headers = [{name: 'Content-Type', value: 'application/json'}];

        return responseHandler(res, response, headers);
    });
}