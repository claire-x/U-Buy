
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
module.exports = link;

// function to calculate the length of a given object
function count(o){
    var n = 0;
    for(var i in o){ 
        n++; 
    }
    return n;
}

// the main function
router.post('/', function (req, res) {
  var pool = new link();

  function SearchID() {
    // function to search the info with given SID for this user as a seller
    this.select=function(callback,id){
      var sql = 'SELECT distinct * FROM post where user_sid = ' + id + ' AND category = "Buyer" And if_matched != 1';
      var option = {};
      pool.query(sql,function(err,result){
        if(err){console.log(err);}
        // default value for result
        option[0] = {'object':"Nothing",'pid':0};
        if(result){
            for(var i = 0; i < result.length; i++){
                option[i]={'pid':result[i].id,"remark":result[i].content,
                  'category':result[i].category, 'college':result[i].college,
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
      var sql1 = 'SELECT * FROM post where category !=? AND college IN (?, "No preference") AND user_sid != ? And object = ? And if_matched != 1';
      var Params = [datas.category,datas.college,datas.sid,datas.object];
      var option1 = {};
      pool.query(sql1,Params,function(err,results){
        if(err){console.log(err);}
        // default result
        option1[0]={'category':null,'object':"Nothing", 'sid':null};
        if(results){
            for(var i = 0; i < results.length; i++)
            {
                option1[i]={'pid':results[i].id,'category':results[i].category,'college':results[i].college,
                'sid':results[i].user_sid, 'remark':results[i].content,
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
          option[0]={'user_id1':"00000",'user_id2':null,'result':0,'pid2':0};
          if(result){
              for(var i = 0; i < result.length; i++)
              {   
                  option[i]={'id':result[i].id,'user_id1':result[i].user_id1,'user_id2':result[i].user_id2, 
                  'object':result[i].object, 'pid2':result[i].pid2, 'remark1':result[i].remark1,
                      'result': result[i].result, 'pid1': result[i].pid1, 'pid2':result[i].pid2};
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
    this.select=function(id1,id2,obj,pid1,pid2,remark1,remark2){  
      var sql = 'INSERT INTO match_result (id,user_id1,user_id2,`object`,result,pid1,pid2,remark1,remark2) VALUES (0,"'+id1+'","'+id2+'","'+obj+'",2,"'+pid1+'","'+pid2+'","'+remark1+'","'+remark2+'")';
      pool.query(sql,function(err){
          if(err){console.log(err);}
      });
    };
  }
  module.exports = SaveID;

  // check if the user was matched before with given sid
  function CheckRE(){
    this.select=function(callback,id){
      var sql = 'SELECT * FROM match_result where user_id2 = ' + id ;
      var option = {};  
      pool.query(sql,function(err,result){
        if(err){console.log(err);}
        option[0]={'user_id2':"00000",'pid2':0};
        if(result){
            for(var i = 0; i < result.length; i++)
            {
                option[i]={'id':result[i].id,'res1':result[i].res1,'res2':result[i].res2,
                'user_id1':result[i].user_id1,'user_id2':result[i].user_id2, 'pid1': result[i].pid1, 'pid2':result[i].pid2,
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
            option[0]={'user_id2':"00000",'pid2':0};
            if(result){
                for(var i = 0; i < result.length; i++)
                {
                    option[i]={'id':result[i].id,'res1':result[i].res1,'res2':result[i].res2,
                    'user_id1':result[i].user_id1,'user_id2':result[i].user_id2, 'pid1': result[i].pid1, 'pid2':result[i].pid2,
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
    console.log(userID);
    SeID.select(function(rdataS) {
        datas = rdataS;
        // the user has filled his/her information
        if(datas[0].object!="Nothing") {
    
          // check number of the objects this user want to sell (posted)
          var postList_len = count(datas);
          var AllPid = [];
          for (let i=0;i<postList_len;i++) {
            AllPid[i] = datas[i].pid + '';
          };
          console.log(AllPid);
          
          var AllObject = [];
          for (let i=0;i<postList_len;i++) {
              AllObject[i] = datas[i].object;
          };
          console.log(AllObject);
    
          var l_object= "";
          var l_sid= "";
          var l_remark= "";
          var l_status= "";

          let i = 0;
          // for(let i=0; i<postList_len; i++) {
            ChID.select(function (rdataC){
              datasC = rdataC;
              // no result in 'match_result's
              if((datasC[0].result == 0)||(datasC[0].result == '-1')) {
                // make sure the failed matching won't occur again
                RChID.select(function(rdataR){

                  // get the ban list
                  var ban = Array;
                  for(let j=0;j<count(rdataR);j++){
                  if((rdataR[j].user_id2 == userID)&&(rdataR[j].pid2 == AllPid[i]))
                      ban[j] = rdataR[j].user_id1;
                  }
                    // match the buyer
                    MaID.select(function(rdataM) {
                      datas1 = rdataM;
    
                      // No result
                      if((datas1[0].object == "Nothing")||(datas1[0].object == "Others")) {
                        res.render('NoBuyer.hbs',{
                          r_object1: AllObject[0],
                          r_object2: AllObject[1],
                          r_object3: AllObject[2],
                          r_object4: AllObject[3],
                          username: req.cookies.islogin.name,
                          login: 1
                        });
                      }
                      // have result: choose the best buyer
                      // "others" type not be included
                      else{
                        var len = count(datas1);
                        var len = count(datas1);
                        var overlap = 0;
                        var interval = 0;
                        var min_interval = 10000;
                        var st = datas[0].price_min; // seller's acceptable min price
                        var ed = datas[0].price_max; // seller's acceptable max price
                        var choice;

                        for(var k=0 ; k<len; k++){
                            var check = 0;
                            for(var j=0; j<count(ban); j++){
                                if (ban[j] == datas1[k].sid) {
                                    check = 1;
                                    break;
                                }
                            }
                            if(check==1) continue;
                            // check if two price intervals overlap and find the highest price_max of buyer
                            overlap = datas1[k].price_max - st;
                            interval = Math.min(st,datas1[k].price_max) - Math.max(st,datas1[k].price_max);
                            if ((overlap >= 0) && (interval < min_interval)){
                                min_interval = interval;
                                choice = datas1[k];
                            }
                        }

                        if(min_interval==10000)  {
                          // All possible buyers are banned
                          l_object = l_object + "<td id ='obj" + i + "'>" + AllObject[i] + "</td>";
                          l_sid = l_sid + "<td id ='sid" + i + "'>NA</td>"; 
                          l_remark = l_remark + "<td id ='remark" + i + "'>NA</td>";
                          l_status = l_status + "<td id ='status" + i + "'>not match yet</td>";
                          res.render('NoBuyer.hbs',{
                            r_object1: AllObject[0],
                            r_object2: AllObject[1],
                            r_object3: AllObject[2],
                            r_object4: AllObject[3],
                            username: req.cookies.islogin.name,
                            login: 1
                          });
                        }
                        else {
                          // save the matching result and render the hbs document
                          SaID.select(choice.sid,userID,choice.object,choice.pid,AllPid[i],choice.remark,datas[0].remark);
                          l_object = l_object + "<td id ='obj" + i + "'>" + choice.object, + "</td>";
                          l_sid = l_sid + "<td id ='sid" + i + "'>" + choice.sid + "</td>"; 
                          l_remark = l_remark + "<td id ='remark" + i + "'>" + choice.remark + "</td>";
                          l_status = l_status + "<td id ='status" + i + "'>waiting for reply</td>";

                          var yourDecision = 
              '<form action="http://localhost:8081/result_buyer" method="Post">'+
                  '<br><br>'+
                  '<input type="radio" name="result" value="accept" required> I am notified of this match.'+
                  '<br><br>'+
                  '<input type="radio" name="result" value="refuse"> I am notified, but I do not want to match again, please delete my trading message.'+
                  '<br><br>' +
                  '<input type="submit" class="tm-btn-primary" style="border-color: white" value="Submit"></input>'+
              '</form>';

                          res.render('YesBuyer.hbs',{
                            layout: null,
                            r_object: l_object,
                            r_sid: l_sid,
                            r_remark: l_remark,
                            r_status: l_status,
                            r_object1: AllObject[0],
                            r_object2: AllObject[1],
                            r_object3: AllObject[2],
                            r_object4: AllObject[3],
                            yourDecision: yourDecision,
                            username: req.cookies.islogin.name,
                            login: 1
                        });
                        }
    
                      }

    
                      
                    },datas[0]);
                  
                },userID);
              }
    
              // there is already a matching result
              else {
                // get the other one's SID
                var otherID;
                if((datasC[0].user_id2==userID)) {
                  otherID = datasC[0].user_id1;
                }
    
                SeID.select(function(rdataM) {
                  datas2 = rdataM;
                        
                  var reply = "waiting for reply";
                  var dataR = Array;
    
                  // the matching is already successful
                  if (datasC[0].result=='1'){
                    reply = "Success!";
                    var ChRE = new CheckRE();
                    ChRE.select(function(rdata){
                        dataR = rdata;
                        // console.log("matching already successful");
                        console.log("user id 2 & 1 " + datasC[0].pid2 +" " +datasC[0].user_id1 +" postid "+ datasC[0].pid1);
                        l_object = l_object + "<td id ='obj" + i + "'>" + datasC[0].object, + "</td>";
                        l_sid = l_sid + "<td id ='sid" + i + "'>" + datasC[0].user_id1 + "</td>"; 
                        l_remark = l_remark + "<td id ='remark" + i + "'>" + datasC[0].remark1 + "</td><br>" +
                            "<div class='form - group'><input id = 'new_chat'  type='button' value='go to chat' class = 'chat' onclick='gotochat()' values =" +
                            datasC[0].user_id1 + " uid =" + datasC[0].pid1 + "> </div><br>";
                        l_status = l_status + "<td id ='status" + i + "'>" + reply + "</td>";

                        var instruct = 'Please click below and initiate a <b>Trading Chat</b>.';

                        var sellerPostID = { sellerPID: datasC[0].pid2 };
                        res.cookie('sellerPostID', sellerPostID, { maxAge: 2 * 3600 * 1000 });


                        res.render('YesBuyer.hbs',{
                          layout: null,
                          r_object: l_object,
                          r_sid: l_sid,
                          r_remark: l_remark,
                          r_status: l_status,
                          chatId: "<td>Chatroom：</td>" + "<td id ='chatId" + i + "'>" + datasC[0].user_id1 + "tag_" + datasC[0].pid1 + "</td>",
                          r_object1: AllObject[0],
                          r_object2: AllObject[1],
                          r_object3: AllObject[2],
                            r_object4: AllObject[3],
                            instruct: instruct,
                          username: req.cookies.islogin.name,
                          login: 1
                      });
                    },userID);
                    }
    
                    // the matching hasn't been done
                    else if (datasC[0].result!='-1'){
                        // console.log("the matching hasn't been done, "+datasC[0].object);
                        l_object = l_object + "<td id ='obj" + i + "'>" + datasC[0].object, + "</td>";
                        l_sid = l_sid + "<td id ='sid" + i + "'>" + datasC[0].user_id1 + "</td>"; 
                        l_remark = l_remark + "<td id ='remark" + i + "'>" + datasC[0].remark1 + "</td>";
                      l_status = l_status + "<td id ='status" + i + "'>" + reply + "</td>";

                      var yourDecision =
                          '<form action="http://localhost:8081/result_buyer" method="Post">' +
                          '<br><br>' +
                          '<input type="radio" name="result" value="accept" required> I am notified of this match.' +
                          '<br><br>' +
                          '<input type="radio" name="result" value="refuse and delete"> I am notified, but I do not want to match again, please delete my trading message.' +
                          '<br><br>' +
                      '<input type="submit" class="tm-btn-primary" style="border-color: white" value="Submit"></input>' +
                          '</form>';

                        res.render('YesBuyer.hbs',{
                          layout: null,
                          r_object: l_object,
                          r_sid: l_sid,
                          r_remark: l_remark,
                          r_status: l_status,
                          r_object1: AllObject[0],
                          r_object2: AllObject[1],
                          r_object3: AllObject[2],
                          r_object4: AllObject[3],
                            username: req.cookies.islogin.name,
                            yourDecision: yourDecision,
                          login: 1
                      });
                    }
                    else {
                      l_object = l_object + "<td id ='obj" + i + "'>" + AllObject[i] + "</td>";
                      l_sid = l_sid + "<td id ='sid" + i + "'>" + '' + "</td>"; 
                      l_remark = l_remark + "<td id ='remark" + i + "'>" + '' + "</td>";
                      l_status = l_status + "<td id ='status" + i + "'>not match yet</td>";
                      res.render('NoBuyer.hbs',{
                        r_object1: AllObject[0],
                        r_object2: AllObject[1],
                        r_object3: AllObject[2],
                        r_object4: AllObject[3],
                        username: req.cookies.islogin.name,
                        login: 1
                    });
                    }
    
    
                },otherID);
              }
            },userID)
          // }

        }
    
        // the user hasn't filled his/her information
        else {
            console.log("NOTHING FOUND for " + userID);
            res.render('NoBuyer.hbs',{
                username: req.cookies.islogin.name,
                login: 1
            });
        }
    
    
    
      },userID);    


});

module.exports = router;
