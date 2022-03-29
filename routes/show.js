var express = require('express');
var DB = require('../plugin/database')
var app = express.Router();
var bodyParser = require('body-parser');
fs = require('fs');
var path = require('path');
urlLib = require('url');
var urlencodedParser = bodyParser.urlencoded({extended: false });
let http = require('http').Server(app);
let io = require('socket.io')(http);
app.use(bodyParser.json());
app.use(urlencodedParser);
app.use(express.static(path.join('.','public')));
var cookieParser = require('cookie-parser');
app.get('/',urlencodedParser, function (req, res){
	
    let userID = req.cookies.islogin.sid; 
    //console.log(userID);
    fs.readFile('./chat_record/dialogue_relation.txt','utf8',function(err,data){
    if(err){
      console.log('err:'+err);
    }
    else{

      function toString(data,need){
        if(data.indexOf(need)!=-1){
          data = data.replace(need,'"');
          return toString(data,need);
        }
        else{
          return data;
        }
      };
      var l = toString(data,'‘');
    var r = toString(l,'’');
    if (JSON.parse(r)[userID] == null) {
        res.write('not exists');
       
    }
    else{
    //console.log(JSON.parse(r)[userID]);
    res.write(JSON.stringify(JSON.parse(r)[userID]));
    console.log('response is '+ JSON.stringify(JSON.parse(r)[userID]));
    res.end();
    console.log('has read your friend list');
}
}});
    //res.redirect('/chat.html');
  }
  );
app.get('/delete',function (req,res){
	console.log('begin deletion');
	let userID = req.cookies.islogin.sid; 
	var json = urlLib.parse(req.url,true).query;
	type = json['type'];
	delete_id = json['id'];
	//console.log(type+ 'dfs' +delete_id);
	fs.readFile('./chat_record/dialogue_relation.txt','utf8',function(err,data){
    if(err){
    	res.end();
    	console.log('err:'+err);
    }
    else{

      function toString(data,need){
        if(data.indexOf(need)!=-1){
          data = data.replace(need,'"');
          return toString(data,need);
        }
        else{
          return data;
        }
      }
    var l = toString(data,'‘');
    var r = toString(l,'’');
    dict = JSON.parse(r);
    array = dict[userID][type];
    array2 = [];
    for(var i = 0; i< array.length;i++){
    	if(array[i] != delete_id){
    		array2.push(array[i]);
    	}}
    dict[userID][type] = array2;

    if (type == "sid"){ type = "cid"}
    else {type = "sid"}
    array = dict[delete_id][type];
    array2 = [];
    for(var i = 0; i< array.length;i++){
    	if(array[i] != userID){
    		array2.push(array[i]);
    	}}
    dict[delete_id][type] = array2;





    dict = JSON.stringify(dict);
    console.log(dict);
    fs.writeFile('./chat_record/dialogue_relation.txt',dict,function(err){
						if(err){
							res.end();
							console.log('err:'+err);
						}
						else{
							console.log('删除成功');
							res.write('successfully delete');
							res.end();
						}});
}});
});
app.get('/create',function (req,res){
	console.log('begin creation');
	let userID = req.cookies.islogin.sid;
	var json = urlLib.parse(req.url,true).query;
	add_id = json['id'];
  var judge = "no need to create!!! he/she is already in to your friend list~~~~~~~~";
  DB.select_user_data(add_id, 
    function(data){
      if(data.length==0){
        res.write('sid does not exists');
        res.end()
      }
      else{
        console.log(data[0])
      




	fs.readFile('./chat_record/dialogue_relation.txt','utf8',function(err,data){
    if(err){
    	res.end();
      console.log('err:'+err);
    }
    else{

      function toString(data,need){
        if(data.indexOf(need)!=-1){
          data = data.replace(need,'"');
          return toString(data,need);
        }
        else{
          return data;
        }
      }
    var l = toString(data,'‘');
    var r = toString(l,'’');
    dict = JSON.parse(r);
    
function contains(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] == obj) {
            return true;
        }
    }
    return false;}

    if (!(add_id in dict)){
    	dict[add_id] = {"cid":[userID],"sid":[]};}
   
    if (!((contains(dict[add_id]['cid'],userID) || contains(dict[add_id]['sid'],userID)))) {
    		dict[add_id]['cid'].push(userID);
    	}
    
    if (!(userID in dict)){
    	dict[userID] = {"cid":[],"sid":[add_id]};}
   
    if (!((contains(dict[userID]['cid'],add_id) || contains(dict[userID]['sid'],add_id)))) {
    	judge = "successfully added a new friend!!!!!!!";
    	dict[userID]['sid'].push(add_id);
    	}
    
    dict = JSON.stringify(dict);
    console.log(dict);






    fs.writeFile('./chat_record/dialogue_relation.txt',dict,function(err){
						if(err){
							console.log('err:'+err);
							res.end();
						}
						else{
							console.log('创立成功');
							res.write(judge);
							res.end();
						}});
}});}
    });
});



module.exports = app;