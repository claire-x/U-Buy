/* ref: https://github.com/LI-YUXIN-Ryan-Garcia/CUPar-CSCI3100-Project.git */
var nodemailer = require('nodemailer');
var config = require('../config').config;

// configuration for mailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.mail_account,
        pass: config.mail_pwd
    }
});


// send email to koulimlim@gmail.com by default
exports.send = function (mailOptions, callback) {
    mailOptions = mailOptions || {
        // default email
        from: '"U Buy" <' + config.mail_account + '>',
        to: 'koulimlim@gmail.com',
        subject: 'Test',
        text: 'this is a test email',
        html: '<b>The main content of the mail. You have successfully logged in to Nodejs.</b>' 
    };

    transporter.sendMail(mailOptions, function (error, info){
        if (error) {
            callback(error);
            return console.log(error);
        }
        callback();
        console.log('Message sent: ' + info.response);
    });
};

// the template email for reset password
exports.resetEmail = function( email, name, code){
    return {
        from: '"U Buy" <'+ config.mail_account +'>',
        to: email,
        subject: "The CAPTCHA for your to reset password",
html: `
<pre style="font-family:calibri;font-size:17px">
Hi ` + name + ` : 
    
    Here is your CAPTCHA Code for reset your password: <b>` + code + `</b> , please enter it into form in 10 minitues :)
    Here is U Buy, a second-hand trading platform for all CUHK Undergraduate students! Start to look for your buyer/seller now!
    
Best wishes,
U Buy Corporation Limited
</pre> 
`
    };
};

// the template email for authentication
exports.authEmail = function( email, name, code){
    return {
        from: '"U Buy" <'+ config.mail_account +'>',
        to: email,
        subject: "The CAPTCHA for your to sign up U Buy",
html: `
<pre style="font-family:calibri;font-size:17px">
Hi ` + name + ` : 
    
    Welcome! Here is your CAPTCHA Code for authentication: <b>` + code + `</b> , please enter it into form in 10 minitues :)
    Thank you for your registration. Here is U Buy, a second-hand trading platform for all CUHK Undergraduate students! Start to look for your buyer/seller now!
    

Best wishes,
U Buy Corporation Limited
</pre> 
`
    };
};

// the template email for deletion
exports.delEmail = function( email, name, code){
    return {
        from: '"U Buy" <'+ config.mail_account +'>',
        to: email,
        subject: "The CAPTCHA for your to sign up U Buy",
html: `
<pre style="font-family:calibri;font-size:17px">
Dear ` + name + ` : 
    
    Thank you for your usage. We are sorry to hear that you want to leave. Here is your CAPTCHA Code for authentication: <b>` + code + `</b> , please enter it into form in 10 minitues :)
    We are looking forward to you coming back. Here is U Buy, a second-hand trading platform for all CUHK Undergraduate students!
    

Best wishes,
U Buy Corporation Limited
</pre> 
`
    };
};