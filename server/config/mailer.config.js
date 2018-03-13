import mailer from 'nodemailer'
import { config } from './package-config';

let transport = mailer.createTransport({
    host: config.host,
    port: config.port,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: config.mailUser,
        pass: config.mailPassword
    }
});

transport.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

export {transport}