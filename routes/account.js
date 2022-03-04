/* ref: https://github.com/LI-YUXIN-Ryan-Garcia/CUPar-CSCI3100-Project.git */
var express = require('express');
let router = express.Router();

router.get('/', function( req, res){
    
    // If user hasn't logged in
    if( !req.session.passport ){ 
        res.redirect('/login');
    }

    // get user's information
    let user_name = req.cookies.islogin.name;
    let userID = req.cookies.islogin.sid; 
    
    // render the hbs document
    res.render('account.hbs', {
        layout: null,
        name: user_name,
        sid : userID,
        email: userID + "@link.cuhk.edu.hk",
        username: user_name,
        login: 1
    });

});

module.exports = router;