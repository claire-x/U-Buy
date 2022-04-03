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
        if (result.length === 0) { // have not registed yet
            res.render('admin_reset_acct.hbs', {
                layout: null,
                warning: 'The user have not registed yet'
            });
        } else { // have registed already
            if (result[0].state === 1) { // active
                    // continue to reset pwd
                    req.session.sid = { sid: sid }; // save identity
                    res.redirect('/admin_reset/pwd');
            }
            else { // inactive
                res.render('admin_reset_acct.hbs', {
                    layout: null,
                    message: 'It is an inactive account',
                    notice: 'Ask user to sign up'
                });
            }
        }
    });
});


// the subrouter for reset password
router.get('/pwd', function (req, res) {
    if (!req.session.sid) {   // refuse invalid access
        return res.redirect('/login');
    }
    res.render('admin_reset_pwd.hbs', {
        layout: null,
        info: 'Please enter the new password'
    });
});

router.post('/pwd', function (req, res) {
    let sid = req.session.sid.sid;
    res.session = null; // clean sesssion
    let password = req.body.password;
    let passwordRP = req.body.passwordRP;

    if (password !== passwordRP) { // passwords don't match
        return res.render('admin_reset_pwd.hbs', {
            layout: null,
            error: 'Please confirm your password.'
        });
    }

    password = md5(password); // encrypt the password
    // find the user
    DB.select_user_data(sid, function (result) {
        if (result.length === 0) {
            return console.log(" Can't find the user, error");
        }
        let data_set = { password: password };
        DB.update_user(sid, data_set, callback = function (err) {
            if (err) {
                console.error('----Some error(s) happened while udpating user pwd')
            }
            res.render('admin_reset_pwd.hbs', {
                layout: null,
                message: 'Reset user password successfully'
            });
        });
    });
});

module.exports = router;