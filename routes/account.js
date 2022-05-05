/**
 * Module to render user account page
 *
 *  @programmer: Hui Lam Lam
 *  @version: 1.0 (1 APR 22)
 */


var express = require('express');
let router = express.Router();
var findUser = require('../plugin/database');

router.get('/', function (req, res) {

    // visitor
    if (!req.session.passport) {
        res.redirect('/login');
    }

    // user info
    let user_name = req.cookies.islogin.name;
    let userID = req.cookies.islogin.sid;

    findUser.select_user_data(userID, function (result) {
        UID = result[0].id;
        times = result[0].judgement_times;
        total_scores = result[0].total_scores;
        User_rating = total_scores / times;
        User_rating = User_rating.toFixed(2);

        // render account.hbs
        res.render('account.hbs', {
            layout: null,
            name: user_name,
            sid: userID,
            email: userID + "@link.cuhk.edu.hk",
            username: user_name,
            UID: UID,
            User_rating: User_rating,
            login: 1
        });

    });

});

module.exports = router;