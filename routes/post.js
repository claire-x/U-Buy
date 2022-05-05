/**
 * Module to handle post
 *
 *  @programmer: Hui Lam Lam
 *  @version: 2.0 (1 APR 22)
 *  
 * ref: https://github.com/LI-YUXIN-Ryan-Garcia/CUPar-CSCI3100-Project.git
 */


var express = require('express');
var router = express.Router();
var async = require('async');
var postProcess = require('../plugin/forumdb');

// get post details
router.get('/:postid.html', function(req, res) {
	// get post id
	var postid = req.params.postid || 1;
	// get post details asynchronously
	async.parallel([
		function(callback){
			postProcess.getPost(postid, function(result){
				callback(null, result[0]);
			})
		},
		function(callback){
			postProcess.getReply(postid, function(result){
				callback(null, result);
			})
		},
	], function(err, results){
		// return the outcome 
		res.render('post.ejs', { data:results });
	})
	
});

// set a post to be private
router.get('/setprivate',function(req,res){
	if (!req.session.passport) {
        // user hasn't logged in
        res.redirect('/login');
	}
	else{
		// params from user request
		let postid = parseInt(req.query.postid);
		let status = parseInt(req.query.status);
		let params = {status:status};
		// set private using params
	postProcess.setPrivate(postid,params, function(result){
		// return the outcome
		if(result.affectedRows){
			res.send({code:0});
		}
	});
}
});

// set a post to be public
router.get('/setpublic',function(req,res){
	if (!req.session.passport) {
        // user hasn't logged in
        res.redirect('/login');
	}
	else{

		// params from user request
		let postid = parseInt(req.query.postid);
		let status = parseInt(req.query.status);
		let params = {status:status};
		// set public using params
	postProcess.setPublic(postid,params, function(result){
		// return the outcome
		if(result.affectedRows){
			res.send({code:0});
		}
	});
}
});

// delete a post
router.get('/delete', function (req, res) {
	if (!req.session.passport) {

        // user hasn't logged in
		res.redirect('/login');
	}
	else {

		// params from user request
		let postid = parseInt(req.query.postid);
		postProcess.delete(postid, function (result) {
			// return the outcome
			if (result.affectedRows) {
				res.send({ code: 0 });
			}
		});

		// delete match result
		postProcess.delete_match_result_1(postid, function (result) {
			if (result.affectedRows) {
				console.log("delete, pid1");
			}
		});

		// delete match result
		postProcess.delete_match_result_2(postid, function (result) {
			if (result.affectedRows) {
				console.log("delete, pid2");
			}
		});

	}
});

// add a new reply
router.get('/newreply', function(req, res){
	if (!req.session.passport) {
		// user hasn't logged in
        res.redirect('/login');
    }
	else {
		// params from user request
		    let postid = parseInt(req.query.postid);
			let content = req.query.content;
            let userID = req.cookies.islogin.id;
            let createtime = new Date().toString().substr(0,25);
			let params = {postid:postid, uid:userID, content:content, createtime:createtime};
		// add a reply using params
		postProcess.addReply(params, function(result){
			// return the outcome
            if(result.affectedRows){
				res.send({code:0, data:{rid:result.insertId ,createtime:createtime}});
			}
		});
	}
});

// add a new post
router.get('/newpost', function(req, res){
	if (!req.session.passport) {
        // user hasn't logged in
        res.redirect('/login');
    }
    else{
		// params from user request
		let title = req.query.title;
		let	content = req.query.content;
		let userID = req.cookies.islogin.id;
		let user_sid = req.cookies.islogin.sid;
        let user_name = req.cookies.islogin.name;
		let createtime = new Date().toString().substr(0, 25);
		let min_price = req.query.min_price;
		let max_price = req.query.max_price;
		let college = req.query.college;
		let object = req.query.object;
		let category = req.query.category;

		let params = { user_sid: user_sid, uid: userID, title: title, content: content, createtime: createtime, price_min: min_price, price_max: max_price, college: college, object: object, category: category};

		// add a post using params 
		postProcess.addPost(params, function(result){
			// return the outcome
            if(result.affectedRows){
				let postID = { id: result.insertId };
				res.cookie('postID', postID, { maxAge: 2 * 3600 * 1000 });
                res.send({code:0,data:{url:'/post/'+result.insertId+'.html', title:title, author:user_name, createtime:createtime}});
            }
		});
	}
});

module.exports = router;
