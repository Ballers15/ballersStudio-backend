const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const projectName = 'Ballers';
const mg = mailgun.client({
	username: process.env.MAILGUN_DOMAIN,
	key: process.env.MAILGUN_API_KEY,
});


let sendMail = function(from, to, subject, message, cb) {

    const data = {
        from: from,
        to: to,
        // cc: 'baz@example.com',
        // bcc: 'bar@example.com',
        subject: subject,
        text: message,
        html: message,
        // attachment: attch
    };
    mg.messages
	.create(sandboxf8c47bd53e894eb989031382157502b5.mailgun.org, {data})
	.then(msg => console.log(msg)) // logs response data
	.catch(err => console.log(err)); // logs any error`;
}

exports.sendAuthOtp = function(data, response, cb) {

    if(!cb){
        cb = response;
    }

    let user = {
        email: data.email
    };
    let generatedOTP = data.otp
    var hostUrl = process.env.EMAIL_HOST
  
    let subject = `OTP ${projectName}`;
    let from = process.env.EMAIL_HOST;
    let to = `${user.email}`;
    let message = `${hostUrl}, email:${user.email}, otp:${generatedOTP}`

    console.log(message)

    sendMail(from, to, subject, message, function(error, data) {
        if (error) {
            return cb(error);
        }
        return cb(null, data);
    })
};