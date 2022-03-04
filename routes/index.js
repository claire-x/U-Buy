/* ref: https://github.com/LI-YUXIN-Ryan-Garcia/CUPar-CSCI3100-Project.git */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    if (req.session.passport) {
        // user has logged in
        res.render("index.hbs", {
            layout: null,
            username: req.session.passport.name, 
            login: 1
        });
    } else {
        res.render("index.hbs", {
            layout: null,
            username: "My Page",
            login: 0
        });
    }
});

router.get('/index', function( req, res){
    if (req.session.passport) {
        // user has logged in
        res.render("index.hbs", {
            layout: null,
            username: req.session.passport.name, 
            login: 1
        });
    } else {
        res.render("index.hbs", {
            layout: null,
            username: "My Page",
            login: 0
        });
    }
});

module.exports = router;