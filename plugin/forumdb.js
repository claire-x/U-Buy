/**
 *
 *  @programmer: Hui Lam Lam; Zhang chi
 *  @version: 2.0 (1 APR 22)
 *
 * ref: https://github.com/LI-YUXIN-Ryan-Garcia/CUPar-CSCI3100-Project.git
 */

var mysql = require('mysql');
var config = require('../config').config;

var pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : config.db_pwd,
    database: config.db_name
});

var dbprocess = {
    // update a negotiation process
    update_negotiation_process: function(uid,sid,cid,value,callback){
        pool.getConnection(function(err,connection) {
            if (err) throw err;
            let sql = 'UPDATE `negotiation_record` set `negotiation_prase` ='+value+' where (`uid` ='+uid+' AND `buyer_id` = '+sid+' AND `seller_id` ='+cid+');'
            console.log(sql)
            connection.query(sql, function(err,result){
                connection.release();
                if(err){
                    console.error(err)
                }
                callback(result);
            }) 
        })

    },
    // query a negotiation process
    query_negotiation_process: function(uid,sid,cid,callback){
        pool.getConnection(function(err,connection) {
            if (err) throw err;
            let sql = 'SELECT negotiation_prase from negotiation_record where (`uid` ='+uid+' AND `buyer_id` = '+sid+' AND `seller_id` ='+cid+');'
            console.log(sql)
            connection.query(sql, function(err,result){
                connection.release();
                if(err){
                    console.error(err)
                }
                callback(result);
            })
        })

    },
    // modify if_matched into 1
    modify_post:function(uid){
        pool.getConnection(function(err,connection){
        if(err){throw err}
        let sql = 'UPDATE `post` set `if_matched` = 1 where `id` ='+uid+';'
        console.log("has successful modify post table")
        connection.query(sql,function(err,result){
            if(err){
                throw(err)
            }
            else{
                console.log("successful modify post table if_matched into 1")
            }})  })},

    // add negotiation process
    add_negotiation_process: function(uid,sid,cid){
        pool.getConnection(function(err,connection) {
            if (err) throw err;
            let sql = 'INSERT INTO `negotiation_record` VALUES ('+uid+','+sid+','+cid+', 0);'
            console.log(sql)
            connection.query(sql, function(err,result){
                connection.release();
                if(err){
                    console.error(err)
                }
            })
        })

    },

    // delete a post
    delete: function (postid, callback) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            let strSql = 'Delete from `post` WHERE `id` = ' + postid;
            connection.query(strSql, function (err, result) {
                connection.release();
                if (err) {
                    console.error(err);
                }
                callback(result);
            })
        });
    },

    // delete match result once a post get deleted
    delete_match_result_1: function (postid, callback) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            let strSql = 'Delete from `match_result` WHERE `pid1` = ' + postid;
            connection.query(strSql, function (err, result) {
                connection.release();
                if (err) {
                    console.error(err);
                }
                callback(result);
            })
        });
    },

    // delete match result once a post get deleted
    delete_match_result_2: function (postid, callback) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            let strSql = 'Delete from `match_result` WHERE `pid2` = ' + postid;
            connection.query(strSql, function (err, result) {
                connection.release();
                if (err) {
                    console.error(err);
                }
                callback(result);
            })
        });
    },

    // update the post status to be private
    setPrivate:function(postid,params,callback){
        pool.getConnection(function(err,connection){
            if(err) throw err;
            let strSql ='UPDATE `post` SET ? WHERE `id` = '+postid;
            connection.query(strSql, params, function(err, result){
                connection.release();
                if(err) {
                   console.error(err);
                }
                callback(result);
            })
        });
    },
    // update the post status to be public
    setPublic:function(postid,params,callback){
        pool.getConnection(function(err,connection){
            if(err) throw err;
            let strSql ='UPDATE `post` SET ? WHERE `id` = '+postid;
            connection.query(strSql, params, function(err, result){
                connection.release();
                if (err) {
                    console.error(err);
                }
                callback(result);
            })
        });
    },
    // inser a newly created post
    addPost:function (params, callback){
        pool.getConnection(function(err, connection){
            if(err) throw err;
            let strSql ='INSERT INTO `post` SET ?';
            connection.query(strSql, params, function(err, result){
                connection.release();
                if (err) {
                    console.error(err);
                }
                callback(result);
            })
        });
    },
    // insert reply
    addReply : function(params, callback){
        pool.getConnection(function(err, connection){
            if(err) throw err;
            let strSql = 'INSERT INTO `comment` SET ?';
            connection.query(strSql, params, function(err, result){
                connection.release();
                if (err) {
                    console.error(err);
                }
                callback(result);
            })
        });
    },
    // get all public posts
    displayPosts : function(callback){
        pool.getConnection(function(err, connection){
            if(err) throw err;
            let strSql ='SELECT `post`.*, name,SID FROM `post`, `account` WHERE `post`.`status`= 0 AND `post`.`uid`=`account`.`id` ';
            connection.query(strSql, function(err, result){
                connection.release();
                if (err) {
                    console.error(err);
                }
                callback(result);
            })
        });
    },
    // get my posts
    displayMyPost : function(id,callback){
        pool.getConnection(function(err, connection){
            if(err) throw err;
            let strSql ='SELECT `post`.* FROM `post` WHERE `post`.`uid`= '+id;
            connection.query(strSql, function(err, result){
                connection.release();
                if (err) {
                    console.error(err);
                }
                callback(result);
                
            })
        });
    },
    // get detail for a post
    getPost:function (id, callback){
        pool.getConnection(function(err, connection){
            if(err) throw err;
            let strSql='SELECT * FROM `post` WHERE `post`.`id`=?';
            connection.query(strSql, [id], function(err, result){
                connection.release(); 
                if(err) {
                    console.error(err);
                }
                callback(result);
            })
        });
    },
    // get comments for a post
    getReply : function(postid, callback){
        pool.getConnection(function(err, connection){
            if(err) throw err;
            let strSql = 'SELECT * FROM `comment` WHERE `postid`=?'
            connection.query(strSql, [postid], function(err, result){
                connection.release(); 
                if(err) {
                    console.error(err);
                }    
                callback(result);
                
            })
        });
    }
}
module.exports = dbprocess;