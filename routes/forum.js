/**
 * Module to handle general user login
 * ref: https://github.com/LI-YUXIN-Ryan-Garcia/CUPar-CSCI3100-Project.git
 */

var express = require('express');
var router = express.Router();
var postnum;
var datainDB = require('../plugin/forumdb');

// show all public posts in the post DB
router.get('/', function(req, res) {
    if (!req.session.passport) {
        // user hasn't logged in
        res.redirect('/login');
    }
    else{
        // return public posts
	    datainDB.displayPosts(function(result){
            // posts are all private or no post was found
            console.log(result)
            postnum = result.length;
            if(result.length != 0)
		    res.render('index.ejs', { data:result,datalength:postnum });
            else
            res.render('index.ejs',{datalength:postnum});
        });
    }
});

// show my post
router.get('/mypost',function(req,res){
    if (!req.session.passport) {
        // user hasn't logged in
        res.redirect('/login');
    }
    else{
        // return my posts
        datainDB.displayMyPost(req.cookies.islogin.id,function(result){
            // user has't post anything
            mypostnum = result.length;
            if(result.length != 0)
		    res.render('mypost.ejs',{ data:result,datalength: mypostnum });
            else
            res.render('mypost.ejs',{datalength: 0});
        });
    }
})

module.exports = router;