/**
 * Module to handle admin and general user logout
 * 
 *  @programmer: Hui Lam Lam 
 *  @version: 2.0 (1 APR 22)
 */

var express = require('express');
var router = express.Router();

// user logout
router.all('/', function (req, res) {
    // clear user passport
    req.session.passport = null;
    // clear cookie and redirect to login page
    res.clearCookie('islogin', {maxAge: 2 * 3600 * 1000});
    res.redirect('/login');
});

// admin logout
router.all('/admin', function (req, res) {
    // clear admin passport
    req.session.admin_passport = null;
    // clear cookie and redirect to admin login page
    res.clearCookie('admin_islogin', { maxAge: 2 * 3600 * 1000 });
    res.redirect('/admin_login');
});

module.exports = router;