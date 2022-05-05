/**
 * Module to handle user password resetting by admin
 * ref: https://github.com/LI-YUXIN-Ryan-Garcia/CUPar-CSCI3100-Project.git
 */


var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var md5 = require('../plugin/encryption');
var DB = require('../plugin/database');

// from login.js

router.get('/', function (req, res) {
    res.render('admin_reset_acct.hbs', {
        layout: null,
        info: 'Please enter the user SID'
    });
});

router.post('/', urlencodedParser, function (req, res) {
    let sid = req.body.sid;
    DB.select_user_data(sid, function (result) {
        if (result.length === 0) { // the user have not registed 
            res.render('admin_reset_acct.hbs', {
                layout: null,
                warning: 'The user have not registed yet'
            });
        } else { // registed user
            if (result[0].state === 1) { // active account
                    // reset password
                    req.session.sid = { sid: sid }; // save sid
                    res.redirect('/admin_reset/pwd');
            }
            else { // inactive account
                res.render('admin_reset_acct.hbs', {
                    layout: null,
                    message: 'It is an inactive account',
                    notice: 'Ask user to sign up'
                });
            }
        }
    });
});


//  reset password
router.get('/pwd', function (req, res) {
    if (!req.session.sid) { 
        return res.redirect('/login');
    }
    // render admin_reset_pwd.hbs
    res.render('admin_reset_pwd.hbs', {
        layout: null,
        info: 'Please enter the new password'
    });
});

router.post('/pwd', function (req, res) {
    let sid = req.session.sid.sid;
    res.session = null; 
    let password = req.body.password;
    let passwordRP = req.body.passwordRP;

    if (password !== passwordRP) {
        // two passwords are not the same
        return res.render('admin_reset_pwd.hbs', {
            layout: null,
            error: 'Please confirm your password.'
        });
    }

    password = md5(password); 
    // find the user
    DB.select_user_data(sid, function (result) {
        if (result.length === 0) {
            return console.log(" Error: user not found");
        }
        let data_set = { password: password };
        DB.update_user(sid, data_set, callback = function (err) {
            if (err) {
                console.error('Error: cannot update user password')
            }
            res.render('admin_reset_pwd.hbs', {
                layout: null,
                message: 'Reset user password successfully'
            });
        });
    });
});

module.exports = router;