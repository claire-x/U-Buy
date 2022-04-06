
var express = require('express');
let router = express.Router();
var mysql  = require('mysql');  
var config = require('../config').config;

// A module to link the mysql database
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
module.exports=link;

// function to calculate the length of a given object
function count(o){
    var n = 0;
    for(var i in o){ 
        n++; 
    }
    return n;
}

router.post('/', function(req, res) {
    var pool = new link();

    function SearchID() {
        // function to search the info with given SID
        this.select=function(callback,id){
            var sql = 'SELECT distinct * FROM ready_match where user_sid = ' + id + ' AND category = "B"';
            var option = {};
                pool.query(sql,function(err,result){
                    if(err){console.log(err);}
                    // default value for result
                    option[0] = {'object':"Nothing"};
                    if(result){
                        for(var i = 0; i < result.length; i++){
                            option[i]={'category':result[i].category, 'college':result[i].college,
                                        'sid':result[i].user_sid, 'object':result[i].object,
                                        'price_min':result[i].price_min, 'price_max':result[i].price_max};}
                        }
              // If return directly, it will return undefined. So we need call back function to receive the data.
              callback(option); 
          });
      };
  };
  module.exports = SearchID;

    function MatchID(){ 
        // function to filter the data with the given info, including info like object's name, category (to dind seller or to find buyer), accepted price range, preferred transaction place (college)
        this.select=function(callback1,datas){
                // Besides the same info, it also needed to be assured that it's buyer/seller matched, and not the same person
                var sql1 = 'SELECT * FROM ready_match where category !=? AND college = ? AND user_sid != ? And object = ? And if_matched != 1';
                var Params = [datas.category,datas.college,datas.sid,datas.object];
                var option1 = {};
                pool.query(sql1,Params,function(err,results){
                    if(err){console.log(err);}
                    // default result
                    option1[0]={'category':null,'object':"Nothing", 'sid':null};
                    if(results){
                        for(var i = 0; i < results.length; i++)
                        {
                            option1[i]={'category':results[i].category,'college':results[i].college,
                            'sid':results[i].user_sid,
                            'object':results[i].object,'price_min':results[i].price_min,
                            'price_max':results[i].price_max};
                        }
                    }
                    // If return directly, it will return undefined. So we need call back function to receive the data.
                    callback1(option1); 
                });
        };
    };
    module.exports = MatchID;

  
    // check if the user is matched and succeed or the matching hasn't been done with given sid
    function CheckID(){
        this.select=function(callback,id){
        var sql = 'SELECT * FROM match_result where user_id2 = ' + id  +' AND result != 0';
        var option = {};  
        pool.query(sql,function(err,result){
            if(err){console.log(err);}
            option[0]={'user_id1':"00000",'user_id2':null,'result':null};
            if(result){
                for(var i = 0; i < result.length; i++)
                {   
                    option[i]={'user_id1':result[i].user_id1,'user_id2':result[i].user_id2, 
                    'object':result[i].object,
                    'result':result[i].result};
                }
            }
            // If return directly, it will return undefined. So we need call back function to receive the data.
            callback(option); 
        });
        };
    }
    module.exports = CheckID;
  
 
    // insert the matching result into database
    function SaveID(){
        this.select=function(id1,id2,obj){  
        var sql = 'INSERT INTO match_result (id,user_id1,user_id2,`object`,result) VALUES (0,"'+id1+'","'+id2+'","'+obj+'",2)';
        pool.query(sql,function(err){
            if(err){console.log(err);}
        });
        };
    }
    module.exports = SaveID;

  

    // check if the user was matched before with given sid
    function CheckRE(){
        this.select=function(callback,id){
        var sql = 'SELECT * FROM match_result where user_id2 = ' + id;
        var option = {};  
        pool.query(sql,function(err,result){
            if(err){console.log(err);}
            option[0]={'user_id1':"00000",'user_id2':null};
            if(result){
                for(var i = 0; i < result.length; i++)
                {
                    option[i]={'id':result[i].id,'res1':result[i].res1,'res2':result[i].res2,
                    'user_id1':result[i].user_id1,'user_id2':result[i].user_id2, 
                    'object':result[i].object};
                }
            }
            // If return directly, it will return undefined. So we need call back function to receive the data.
            callback(option); 
        });
        };
    }
    module.exports = CheckRE;

    // check if the user was matched but failed with given sid
    function ReCheckID(){
        this.select=function(callback,id){
        var sql = 'SELECT * FROM match_result where user_id2 = ' + id + ' AND result = 0';
        var option = {};  
        pool.query(sql,function(err,result){
            if(err){console.log(err);}
            option[0]={'user_id1':"00000",'user_id2':null};
            if(result){
                for(var i = 0; i < result.length; i++)
                {
                    option[i]={'id':result[i].id,'res1':result[i].res1,'res2':result[i].res2,
                    'user_id1':result[i].user_id1,'user_id2':result[i].user_id2,
                    'object':result[i].object};
                }
            }
            // If return directly, it will return undefined. So we need call back function to receive the data.
            callback(option);
        });
        };
    }
    module.exports = ReCheckID;

    // initial variables and get the module
    var datas = Array;
    var datasC = Array;
    var datas1 = Array;
    var datas2 = Array;
    var SeID = new SearchID();
    var MaID = new MatchID();
    var ChID = new CheckID();
    var RChID = new ReCheckID();
    var SaID = new SaveID();
  
    let userID = req.cookies.islogin.sid;
    SeID.select(function (rdataS){
        datas = rdataS;
        console.log("CHECK ALL THE OBJECTS"+datas);
        // the user has filled his/her information
        if(datas[0].object!="Nothing"){
        
        // check the reault
        ChID.select(function (rdataC){
            datasC = rdataC;

            // no result in 'match_result'
            if(datasC[0].user_id1=="00000")
            {
            // make sure the failed matching won't occur again
            RChID.select(function(rdataR){
                
                // get the ban list
                var ban = Array;
                for(var i=0;i<count(rdataR);i++){
                    if(rdataR[i].user_id2 == userID)
                        ban[i] = rdataR[i].user_id1;
                }
                
                // match the buyer for this user
                // notice that in `match_result`, user_id1 is sid for the buyer, and user_id2 is sid for the seller
                MaID.select(function(rdataM){
                    datas1 = rdataM;
                
                    // No result
                    if(datas1[0].object=="Nothing"){
                        // console.log("Nothing");
                        res.render('NoBuyer.hbs',{
                        username: req.cookies.islogin.name,
                        login: 1
                        });
                    }

                    // have result: choose the best buyer
                    else{
                        var len = count(datas1);
                        var overlap = 0;
                        var interval = 0;
                        var min_interval = 10000;
                        var st = datas[0].price_min; // seller's acceptable min price
                        var ed = datas[0].price_max; // seller's acceptable max price
                        var choice;

                        for(var i=0 ; i<len; i++){
                            var check = 0;
                            for(var j=0; j<count(ban); j++){
                                if (ban[j] == datas1[i].sid) {
                                    check = 1;
                                    break;
                                }
                            }
                            if(check==1) continue;
                            // check if two price intervals overlap and find the highest price_max of buyer
                            overlap = datas1[i].price_max - st;
                            interval = Math.min(st,datas1[i].price_max) - Math.max(st,datas1[i].price_max);
                            if ((overlap >= 0) && (interval < min_interval)){
                                min_interval = interval;
                                choice = datas1[i];
                            }
                        }

                        if(min_interval==10000)  {
                            // All possible buyers are banned
                            res.render('NoBuyer.hbs',{
                                username: req.cookies.islogin.name,
                                login: 1
                            });
                        }
                        else {
                            // console.log("no result and save for the first time");
                            // save the matching result and render the hbs document
                            SaID.select(choice.sid,userID,choice.object);
                            res.render('YesBuyer.hbs', {
                                layout: null,
                                r_object: choice.object,
                                r_sid: choice.sid,
                                r_remark: choice.remark,
                                r_status: "waiting for reply",
                                r_result_id: "(Not prepared yet)",
                                username: req.cookies.islogin.name,
                                login: 1
                            });
                        }
                    }
                },datas[0]);
            },userID);
            }

            // there is already a matching result
            else{
            
                // get the other one's SID
                var otherID;
                if(datasC[0].user_id2==userID) {
                    otherID = datasC[0].user_id1;
                }

                SeID.select(function(rdataM){
                    datas2 = rdataM;
                    
                    var reply = "waiting for reply";
                    var chat = "(Not prepared yet)";
                    var dataR = Array;

                    // the matching is already successful
                    if (datasC[0].result=='1'){
                    reply = "Success!";
                    var ChRE = new CheckRE();
                    ChRE.select(function(rdata){
                        dataR = rdata;
                        chat = dataR[0].id;
                        // console.log("matching already successful");
                        res.render('YesBuyer.hbs', {
                            layout: null,
                            r_object: datasC[0].object,
                            r_sid: datasC[0].user_id1,
                            r_remark: datasC[0].remark,
                            r_status: reply,
                            username: req.cookies.islogin.name,
                            login: 1
                        });
                    },userID);
                    }

                    // the matching hasn't been done
                    else{
                        // console.log("the matching hasn't been done, "+datasC[0].object);
                        res.render('YesBuyer.hbs', {
                            layout: null,
                            r_object: datasC[0].object,
                            r_sid: datasC[0].user_id1,
                            r_remark: datasC[0].remark,
                            r_status: reply,
                            username: req.cookies.islogin.name,
                            login: 1
                        });
                    }

                },otherID);
            }

        },userID);
    
        }
        
        // the user hasn't filled his/her information
        else {
            res.render('NoBuyer.hbs',{
                username: req.cookies.islogin.name,
                login: 1
            });
        }

    },userID);    


});

module.exports = router;
