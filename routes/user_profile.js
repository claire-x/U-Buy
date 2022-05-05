/**
 * Module to retrieve user profile for the admin
 *
 *  @programmer: Hui Lam Lam
 *  @version: 2.0 (1 APR 22)
 *
 */


var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var DB = require('../plugin/database');

router.get('/', function (req, res) {

    if (!req.session.admin_passport) {
        res.redirect('/admin_login');
    }

    // get user info
    DB.select_all_user(function (result) {
        var myoption = "";
        result.forEach(function (entry) {
            myoption = myoption + "<option value='" + entry.SID + "'>" + entry.SID + "</option>";
        });

        // render user_profile.hbs
        res.render('user_profile.hbs', {
            layout: null,
            id: "user ID",
            name: "user name",
            sid: "user student ID",
            email: "user email",
            myoption: myoption,
            login: 1
        });
    });

});


router.post('/', urlencodedParser, function (req, res) {
    let sid = req.body.sid;
    // select a single user
    DB.select_user_data(sid, function (result) {
        if (result.length === 0) {
            // no matched record
            res.redirect('/user_profile');

        } else {
            let name = result[0].name;
            let id = result[0].id;
            let times = result[0].judgement_times;
            let total = result[0].total_scores;
            let score = total / times;
            score = score.toFixed(2);

            DB.select_all_user(function (result) {
                var myoption = "";
                result.forEach(function (entry) {
                    myoption = myoption + "<option value='" + entry.SID + "'>" + entry.SID + "</option>";
                });

                // render user_profile.hbs
                res.render('user_profile.hbs', {
                    layout: null,
                    id: id,
                    name: name,
                    sid: sid,
                    score: score,
                    email: sid + "@link.cuhk.edu.hk",
                    myoption: myoption,
                    login: 1
                });
            });

        }
    });

});


module.exports = router;