/* ref: https://github.com/LI-YUXIN-Ryan-Garcia/CUPar-CSCI3100-Project.git */
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
// var User = require('../models/user');
var md5 = require('../plugin/encryption');
var mailer = require('../plugin/mailer');
var DB = require('../plugin/database');


// subrouter for signup
router.get('/', function (req, res) {
    res.render('acct_signup.hbs', {
        layout: null,
        info: "Click to send verification code to your email",
    });
});

router.post('/', urlencodedParser, function (req, res, next) {
    var username = req.body.username || '', // check string
        password = req.body.password,
        passwordRP = req.body.passwordRP,
        sid = req.body.sid,
        code = req.body.code;

    // check user input
    if (sid.length !== 10 || sid[0] != 1 || sid[1] != 1 || sid[2] != 5 || sid[3] != 5) {
        return res.render('acct_signup.hbs', {
            layout: null,
            error: "SID is invalid!",
        });
    }

    if (password.length < 6 || password.length > 20) {
        return res.render('acct_signup.hbs', {
            layout: null,
            error: "Password length must be between 6 and 20.",
        });
    }

    if (username.length === 0 || username.length > 20) {
        return res.render('acct_signup.hbs', {
            layout: null,
            error: "The length of name must be nonempty and no more than 20.",
        });
    }

    if (password != passwordRP) {
        return res.render('acct_signup.hbs', {
            layout: null,
            error: "Two passwords are not the same.",
        });
    }

    // get user info from db
    DB.select_user_data(sid, function (results) {
        if (results.length > 0) {  // has registed
            if (results[0].state === 1) {
                res.render('acct_signup.hbs', {
                    layout: null,
                    warning: "You have registed, please log in"
                });
            }
            else if (results[0].code != code) { // wrong code
                res.render('acct_signup.hbs', {
                    layout: null,
                    error: "Wrong code, check or send it again"
                });
            }
            else { // correct code, sign up, update revelant info
                password = md5(password);
                // User.updatePwdNameState(sid, username, password, function(result){
                data_set = { name: username, password: password, state: 1 }
                DB.update_user(sid, data_set, function (result) {
                    // set passport as the authentication to access the website
                    let userPassport = { id: results[0].id, name: username, sid: sid, pwd: password };
                    res.cookie("islogin", userPassport, { maxAge: 2 * 3600 * 1000 });
                    res.redirect('/');
                });
            }
        }
    });

});

// the subrouter for sending authentication email
router.post('/email', function (req, res) {
    let code = getCode();  // generate code
    DB.select_user_data(req.body.sid, function (result) {
        if (result.length > 0) { // has registed already
            if (result[0].state === 1) { // is active
                return res.send("002");
            }
            else { // inactive
                // send email
                mailer.send(mailer.authEmail(req.body.email, req.body.username, code), function (err) {
                    if (err) {
                        return res.send('000');
                    }
                    res.send('001');
                });
                // update db
                data_set = { code: code }
                DB.update_user(req.body.sid, data_set)
            }
        }
        else {   // not yet registed 
            // send email
            mailer.send(mailer.authEmail(req.body.email, req.body.username, code), function (err) {
                if (err) {
                    return res.send('000'); 
                }
                res.send('001'); 
            });
            //  record inactive account info
            data_set = { sid: req.body.sid, name: 'anoymous', password: 123456, code: code }
            DB.insert_unactive_user(req.body.sid, 'anoymous', code)
        }
    })
});

// generate verification code
var getCode = function () {
    let num = "";
    for (let i = 0; i < 6; i++) {
        num += Math.floor(Math.random() * 10);
    }
    return num;
};

module.exports = router;