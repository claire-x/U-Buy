
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
    let sid = req.body.SID || 0000000000;
    var category = req.body.category || 0,
    college = req.body.college || '',
    object = req.body.object || '',
    price_min = req.body.price_min || 0,
    price_max = req.body.price_max || 0;

    function SearchID() {
        // function to search the info with given SID
        this.select=function(callback,id){
            var sql = 'SELECT distinct * FROM Buyer where user_sid = ' + id;
            var option = {};
                pool.query(sql,function(err,result){
                if(err){console.log(err);}
                    option[0] = {'object':"Nothing"};
                if(result){
                for(var i = 0; i < result.length; i++)
                {
                    option[i]={'category':result[i].category,'college':result[i].college,
                    'sid':result[i].user_sid,
                    'object':result[i].object,
                    'price_min':result[i].price_min,'price_max':result[i].price_max};}
                }
                // If return directly, it will return undefined. So we need call back function to receive the data.
                callback(option); 
            });
            };
    };
    module.exports = SearchID;
    SeID = new SearchID();

    // check if input format is correct
    if( sid.length !== 10 || sid[0] != 1 || sid[1] != 1 || sid[2] != 5 || sid[3] != 5){
        return res.send("Your SID is wrong!");
    }  else if(college==''||object==''|category==''||price_min==''||price_max=='') {
        return res.send("Your information is not completed!")
    } else {

        // main part of collection users' personal information
        var pool = new link();
        SeID.select(function(rdata){
            if(rdata[0].object=="Nothing"){
                var  addSql = 'INSERT INTO ready_match (request_id, user_sid, category, college, object, price_min, price_max, if_matched) VALUES(0,?,"B",?,?,?,?,0)';
                var  addSqlParams = [sid, category, college, object, price_min, price_max];
                // insert the data collected from input into database
            pool.query(addSql,addSqlParams,function (err, result) {
                if(err){
                    console.log('[INSERT ERROR] - ',err.message);
                    return;
                }
                
            });
            res.send("yes");
            }
            else{res.send("Wrong");
        }

        },req.body.SID);
    }

});


module.exports = router;
