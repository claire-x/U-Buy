
var express = require('express');
var router = express.Router();

router.all('/', function (req, res) {
    req.session.passport = null;
    res.clearCookie('islogin', {maxAge: 2 * 3600 * 1000});
    res.redirect('/login');
});

router.all('/admin', function (req, res) {
    req.session.admin_passport = null;
    res.clearCookie('admin_islogin', { maxAge: 2 * 3600 * 1000 });
    res.redirect('/admin_login');
});

module.exports = router;