'use strict';
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const user = 'admin%40iziphub.com';
const pass = 'Window12';
// create reusable transporter object using the default SMTP transport
// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'admin@iziphub.com',
//         pass: 'Window12'
//     }
// });
let transporter = nodemailer.createTransport(
	smtpTransport('smtps://'+ user +':' + pass +'@smtp.gmail.com')
);


module.exports = transporter;