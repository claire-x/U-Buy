/* ref: https://github.com/LI-YUXIN-Ryan-Garcia/CUPar-CSCI3100-Project.git */
var express = require('express');
var router = express.Router();
var async = require('async');
var postProcess = require('../plugin/forumdb');
const fs = require("fs");

// show each post and its comments
router.get('/:postid.html', function(req, res) {
	// extract postid from url
	var postid = req.params.postid || 1;
	// console.log(postid);
	// asynchronously process get post content and its comments
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
		// send the outcome from database to frontend and render the interface
		res.render('post.ejs', { data:results });
	})
	
});

// set the post to private
router.get('/setprivate',function(req,res){
	// ensure user has logged in, if not redirect to login page
	if( !req.session.passport ){
        res.redirect('/login');
	}
	else{
		// get the parameters sent from frontend request
		let postid = parseInt(req.query.postid);
		let status = parseInt(req.query.status);
		let params = {status:status};
	// console.log(params);
		// send the params to backend and process
	postProcess.setPrivate(postid,params, function(result){
		// send the operation outcome to frontend
		if(result.affectedRows){
			res.send({code:0});
		}
	});
}
});

router.get('/setpublic',function(req,res){
	// ensure user has logged in, if not redirect to login page
	if( !req.session.passport ){
        res.redirect('/login');
	}
	else{
		// get the parameters sent from frontend request
		let postid = parseInt(req.query.postid);
		let status = parseInt(req.query.status);
		let params = {status:status};
	// console.log(params);
		// send the params to backend and process
	postProcess.setPublic(postid,params, function(result){
		// send the operation outcome to frontend
		if(result.affectedRows){
			res.send({code:0});
		}
	});
}
});

// delete post
router.get('/delete', function (req, res) {
	// ensure user has logged in, otherwise redirect to login page
	if (!req.session.passport) {
		res.redirect('/login');
	}
	else {
		// get the parameters sent from frontend request
		let postid = parseInt(req.query.postid);
		postProcess.delete(postid, function (result) {
			// send the operation outcome to frontend
			if (result.affectedRows) {
				res.send({ code: 0 });
			}
		});
	}
});


router.get('/newreply', function(req, res){
	// ensure user has logged in, if not redirect to login page
    if( !req.session.passport ){
        res.redirect('/login');
    }
	else{
			// get the parameters sent from frontend request
		    let postid = parseInt(req.query.postid);
			let content = req.query.content;
            let userID = req.cookies.islogin.id;
            let user_name = req.cookies.islogin.name;
            let createtime = new Date().toString().substr(0,25);
			let params = {postid:postid, uid:userID, content:content, createtime:createtime};
		//console.log(params);
		// send the params to backend and process
		postProcess.addReply(params, function(result){
			// send the operation outcome to frontend
            if(result.affectedRows){
				res.send({code:0, data:{rid:result.insertId ,createtime:createtime}});
			}
		});
	}
});

router.get('/newpost', function(req, res){
	// ensure user has logged in, if not redirect to login page
    if( !req.session.passport ){
        res.redirect('/login');
    }
    else{
		// get the parameters sent from frontend request
		let title = req.query.title;
		let	content = req.query.content;
        let userID = req.cookies.islogin.id;
        let user_name = req.cookies.islogin.name;
		let createtime = new Date().toString().substr(0, 25);
		let min_price = req.query.min_price;
		let max_price = req.query.max_price;
		let college = req.query.college;
		let object = req.query.object;
		let category = req.query.category;

		let params = { uid: userID, title: title, content: content, createtime: createtime, price_min: min_price, price_max: max_price, college: college, object: object, category: category};

		// send the params to backend and process
		postProcess.addPost(params, function(result){
			// send the operation outcome to frontend
            if(result.affectedRows){
				console.log(result.insertId);
				let postID = { id: result.insertId };
				res.cookie('postID', postID, { maxAge: 2 * 3600 * 1000 });
                res.send({code:0,data:{url:'/post/'+result.insertId+'.html', title:title, author:user_name, createtime:createtime}});
            }
		});
	}
});

module.exports = router;
