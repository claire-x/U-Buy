/* ref: https://github.com/LI-YUXIN-Ryan-Garcia/CUPar-CSCI3100-Project.git */
var express = require('express');
var router = express.Router();

router.all('/', function (req, res) {
    req.session.passport = null;
    res.clearCookie('islogin', {maxAge: 2 * 3600 * 1000});
    res.redirect('/login');
});

module.exports = router;