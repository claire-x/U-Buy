/**
 * Module to handle admin user login
 *
 *  @programmer: Hui Lam Lam
 *  @version: 2.0 (1 APR 22)
 *  
 * ref: https://github.com/LI-YUXIN-Ryan-Garcia/CUPar-CSCI3100-Project.git
 */

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var md5 = require('../plugin/encryption');
var DB = require('../plugin/database');

// admin login
router.post('/', urlencodedParser, function (req, res) {
    let aid = req.body.aid || 1234;
    let password = req.body.password;
    // admin login procedure
    password = md5(password); 
    DB.verify_admin_identity(aid, password, function (results) {
        if (results.length > 0) {
                // set admin passport
                let admin_passport = { id: results[0].id, name: results[0].name, aid: aid };
            res.cookie('admin_islogin', admin_passport, { maxAge: 2 * 3600 * 1000 });
                res.redirect('/admin_account_page');
        }
        else {
            res.render('admin_login.hbs', {
                layout: null,
                error: "Password or Admin ID is wrong. Try again~"
            });
        }
    });
});

router.get('/', function (req, res) {
    res.render('admin_login.hbs', {
        layout: null,
        info: 'Please enter you admin ID and password'
    });
});

module.exports = router;

