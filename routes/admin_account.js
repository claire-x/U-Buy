
var express = require('express');
let router = express.Router();

router.get('/', function( req, res){
    
    if (!req.session.admin_passport ){
        res.redirect('/admin_login');
    }

    // get user's information
    let user_name = req.cookies.admin_islogin.name;
    let userID = req.cookies.admin_islogin.aid;
    
    // render the hbs document
    res.render('admin_account.hbs', {
        layout: null,
        name: user_name,
        aid : userID,
        username: user_name,
        login: 1
    });

});

module.exports = router;