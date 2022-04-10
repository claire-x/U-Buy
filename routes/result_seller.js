
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

// the main function
router.post('/', function (req, res) {
    res.redirect("/index");
    let userID = req.cookies.islogin.sid; 
    var pool = new link();

    // function to check match result with SID
    function CheckRE(){
        this.select=function(callback,id){
        var sql = 'SELECT * FROM match_result where user_id1 = '  + id;
        var option = {};  
        pool.query(sql,function(err,result){
            if(err){console.log(err);}
            // default result
            option[0]={'user_id1':"00000",'user_id2':null};
            if(result){
            for(var i = 0; i < result.length; i++)
                {option[i]={'result':result[i].result,'object':result[i].object,
                'pid1':result[i].pid1,'res1':result[i].res1,'res2':result[i].res2,
                'user_id1':result[i].user_id1,'user_id2':result[i].user_id2};}
            }
            // If return directly, it will return undefined. So we need call back function to receive the data.
            callback(option); 
        });
        };
    }
    module.exports = CheckRE;
    ChRE = new CheckRE();


    // update the match result to record the acceptance of buyer
    function SimpleUpdateRE(){
        this.select=function(id,number,result){
        var sql = 'UPDATE match_result SET res' + number + ' = ' + result + ' where user_id1 =' + id;
        pool.query(sql,function(err){
            if(err){console.log(err);}
        });
        };
    }
    module.exports = SimpleUpdateRE;
    SiupRE = new SimpleUpdateRE();

    // update the final result of a matching, result = 1 -> success, result = 0 -> fail 
    function UpdateRE(){
        this.select=function(id,result){
        var sql = 'UPDATE match_result SET result = ' + result + ' where user_id1 =' + id;
        pool.query(sql,function(err){
            if(err){console.log(err);}
        });
        };
    }
    module.exports = UpdateRE;
    UpRE = new UpdateRE();

    // function to delete ready_match 
    function DeleteObj() {
        this.select=function(id,pid){
            var sql = 'DELETE FROM post where user_sid = ' + id  +' AND category = "Seller" AND id =' + pid;
            pool.query(sql,function(err){
                if(err){console.log(err);}
            });
        };
    }
    module.exports = DeleteObj;
    DelObj = new DeleteObj();

    datas = Array;  
    ChRE.select(function(rdata){
        datas = rdata;

        // the matching hasn't succeeded
        if(datas[0].result!=1){

            // user accept the result
            if(req.body.result=="accept")
            {
                var num;
                if(datas[0].user_id1==userID)
                { otherID = datas[0].user_id2; num = 1; }

                // matching is successful
                if(datas[0].res1==1 && num==1)
                { UpRE.select(userID,1); }
                // waiting for the other one's acceptance
                else{ SiupRE.select(userID,num,1); }
            }

            // user refuse the result
            else if (req.body.result=="refuse"){ 
                UpRE.select(userID,0); 
            }
            else {
                UpRE.select(userID,-1);
                DelObj.select(userID,datas[0].pid1); 
            }

        }

        else {
            if(req.body.result=="end") {
                UpRE.select(userID,-1);
                DelObj.select(userID,datas[0].pid1); 
            }
        }
    },userID);
  
});

module.exports = router;
