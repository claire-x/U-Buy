/**
 * Module to render admin account page
 *
 *  @programmer: Hui Lam Lam
 *  @version: 1.0 (1 APR 22)
 */

var express = require('express');
let router = express.Router();

router.get('/', function( req, res){

    // user hasn't logged in as an admin 
    if (!req.session.admin_passport ){
        res.redirect('/admin_login');
    }

    // admin info
    let user_name = req.cookies.admin_islogin.name;
    let userID = req.cookies.admin_islogin.aid;
    
    // render admin_account.hbs
    res.render('admin_account.hbs', {
        layout: null,
        name: user_name,
        aid : userID,
        username: user_name,
        login: 1
    });

});

module.exports = router;