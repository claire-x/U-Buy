
var express = require('express');
let router = express.Router();
var findUser = require('../plugin/database');

router.get('/', function (req, res) {

    // If user hasn't logged in
    if (!req.session.passport) {
        res.redirect('/login');
    }

    // get user's information
    let user_name = req.cookies.islogin.name;
    let userID = req.cookies.islogin.sid;

    findUser.select_user_data(userID, function (result) {
        UID = result[0].id;
        times = result[0].judgement_times;
        total_scores = result[0].total_scores;
        User_rating = total_scores / times;

        // render the hbs document
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