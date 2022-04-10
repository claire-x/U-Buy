
var express = require('express');
let router = express.Router();
var mysql  = require('mysql'); 
//var DB = require('../plugin/database') 
urlLib = require('url');
// A module to link the mysql database
var config = require('../config').config;
function link(){
        return(mysql.createPool({     
        host     : 'localhost',       
        user     : config.db_user,              
        password : config.db_pwd,       
        port: '3306',                   
        database: config.db_name,
        useConnectionPooling: true,
        connectionLimit: 500
    }));
}
module.exports = link;

// the main function
router.get('/', function (req, res) {
console.log('start to modify evaluation system');
var json = urlLib.parse(req.url,true).query;
var pool = new link();
    sid = json['SID'];
    console.log("The sid of the evaluated: "+sid);
score = json['score'];
console.log('extract post database',sid)
let sql = 'SELECT * FROM account WHERE BINARY `sid`="' + sid + '"'

pool.query(sql, function(err, user_list){
        if(err){
            console.error("Some error(s) raised from select_user_data():")
            console.error(err)
            console.error('--------------------')
        }
        k = user_list[0].judgement_times
        z = user_list[0].total_scores
        console.log('the post database is',user_list[0].judgement_times,user_list[0].total_scores)
        pool.query('update account set judgement_times = judgement_times+'+1+', total_scores = total_scores +'+score+'  WHERE sid ='+sid+ ';',  function (err, data) {
                if (err) {
                        throw err;}
   else {
        console.log(' successfully modified database');
    }
});


    })
res.end()
})
router.get('/delete',function(req,res){
        var json = urlLib.parse(req.url,true).query;
        var type = json['type'];
        if(type == "buyer"){
                var buyer = parseInt(req.cookies.islogin.sid); 
                var seller = parseInt(json['id'].substring(0,10));
                var uid = parseInt(json['id'].substring(14))
        }
        else {
                var seller = parseInt(req.cookies.islogin.sid); 
                var buyer = parseInt(json['id'].substring(0,10));
                var uid = parseInt(json['id'].substring(14));

        }
        console.log("uid",uid,"sid",seller,"cid",buyer,"type",type)
        
        var formdb = require('../plugin/forumdb')
        formdb.query_negotiation_process(uid,buyer,seller,function(result){
                var value = 4;
                console.log(result)
                console.log(result[0].negotiation_prase)
                if (result[0].negotiation_prase ==0){
                        console.log("both have not evaluated")
                        res.write("wait")

                        if(type == "seller"){
                                value = 1
                        }
                        else{
                                value = 2
                        }


                }
                else if(result[0].negotiation_prase ==2 && type == 'seller'){
                        console.log("wait for other to evaluate")
                        res.write("ok to evaluate")
                        value = 3
                }
                else if(result[0].negotiation_prase == 3 && type == 'seller'){
                        res.write("wait")
                        value = 3
                }
                else if(result[0].negotiation_prase == 3 && type =='buyer'){
                        res.write('ok to evaluate')
                        value = 4
                }
                else if(result[0].negotiation_prase ==2 && type == 'buyer'){
                         console.log("keep to wait for other to evaluate")
                        res.write("wait")
                        value = 2
                }
                else if (result[0].negotiation_prase ==1 && type == 'buyer'){
                         console.log("wait for other to evaluate")
                        res.write("ok to evaluate")
                        value = 5

                }
                else if(result[0].negotiation_prase == 5 && type == 'buyer'){
                        res.write("wait")
                        value = 5
                }
                else if(result[0].negotiation_prase == 5 && type =='seller'){
                        res.write('ok to evaluate')
                        value = 4
                }
                else if (result[0].negotiation_prase ==1 && type == 'seller'){
                         console.log("keep to wait for other to evaluate")
                        res.write("wait")
                        value = 1
                }
                else if(result[0].negotiation_prase ==4){
                         console.log("you both have evaluated")
                        res.write('fail')
                        res.end()
                }
                formdb.update_negotiation_process(uid,buyer,seller,value,function(data){
                         
                         res.end()
                })
        })


})

module.exports = router;