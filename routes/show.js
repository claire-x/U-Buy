// module to handle chat room inlcuding send receive message, confirm trade, load record delete chat room
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
// check chatroom index first
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
// delete chatroom function
app.get('/delete',function (req,res){
	console.log('begin deletion');
	let userID = req.cookies.islogin.sid; 
	var json = urlLib.parse(req.url,true).query;
	type = json['type'];
	delete_id = json['id'].substring(0,10);;
  console.log('begin deletion',delete_id);
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
    	if(array[i] != json['id']){
    		array2.push(array[i]);
    	}}
    dict[userID][type] = array2;
    //filename = './chat_record/'

    if (type == "sid"){ 
      type = "cid";}
      //filename = filename + type+"_"+userID+"sid_"+delete_id+".txt"};
    else{type = "sid";}
          //filename = filename +"cid_"+delete_id+type+"_"+userID+".txt"};
        
    //fs.unlink(filename,function(params) {
    //console.log("delete chat records");
//});
    array = dict[delete_id][type];
    array2 = [];
    if (json['id'].length>10)
      userID = userID + json['id'].substring(10)
      console.log("modify userID",userID)
    
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
//create a new chatroom
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
      console.log('err:'+err);
    	res.end();
      
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
      let filename = 'cid_'+userID+'sid_'+add_id+'.txt';
      k = []
      fs.writeFile(filename,JSON.stringify(k),function(err){
        if(err){
          res.write('fail to create file to store chat record')
          res.end()


        }
      })
    	dict[add_id] = {"cid":[userID],"sid":[]};}
   
    if (!((contains(dict[add_id]['cid'],userID) || contains(dict[add_id]['sid'],userID)))) {
      let filename = './chat_record/cid_'+userID+'sid_'+add_id+'.txt';
      k = []
      fs.writeFile(filename,JSON.stringify(k),function(err){
        if(err){
          res.write('fail to create file to store chat record')
          res.end()


        }
      })
    		dict[add_id]['cid'].push(userID);
    	}
    
    if (!(userID in dict)){
      let filename = './chat_record/cid_'+userID+'sid_'+add_id+'.txt';
      k = []
      fs.writeFile(filename,JSON.stringify(k),function(err){
        if(err){
          res.write('fail to create file to store chat record')
          res.end()


        }
      })

    	dict[userID] = {"cid":[],"sid":[add_id]};}
   
    if (!((contains(dict[userID]['cid'],add_id) || contains(dict[userID]['sid'],add_id)))) {
      let filename = './chat_record/cid_'+userID+'sid_'+add_id+'.txt';
      k = []
      fs.writeFile(filename,JSON.stringify(k),function(err){
        if(err){
          res.write('fail to create file to store chat record')
          res.end()


        }
      })

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
							console.log('successfully create a new dialogue');
							res.write(judge);
							res.end();
						}});
}});}
    });
});
// load past record
app.get('/record',function(req,res){
  console.log("start to pass the information")

  var json = urlLib.parse(req.url,true).query;
  console.log(json)
  cid = json['cid']
  sid = json['sid']
  if(sid.length >10 && cid.length == 10)
    cid += sid.substring(10)
  if(cid.length > 10 && sid == 10)
    sid += cid.substring(10)


  let filename = './chat_record/cid_'+cid+'sid_'+sid+'.txt'
  fs.readFile(filename,'utf8',function(err,data){
    if(err){console.log('err:',err)}
    else {
      console.log('pass',data,'to the client side')
      res.write(data)
      res.end()
    }
  })
  
});
// open chatroom on the post page direction, add confirm trade button
app.get('/chat_post',function(req,res){
  var json = urlLib.parse(req.url,true).query;
  console.log(json)
  cid = json['cid']
  sid = req.cookies.islogin.sid;
  uid = json['uid']
  console.log(cid,"---",sid,"dsafad",uid)
  ci = parseInt(json['cid'])
  si = parseInt(req.cookies.islogin.sid);
  ui = parseInt(json['uid'])
  
  console.log(ci,"---",si,"dsafad",ui)
  add_id = sid+'tag_'+uid
  userID = cid+'tag_'+uid
  res.cookie('chat_post',sid,{maxAge:1000*3600});
  return_value ={'cid':add_id,'sid':userID}
  res.write(JSON.stringify(return_value));
  console.log('change chat from posts, diction is ')
  fs.readFile('./chat_record/dialogue_relation.txt','utf8',function(err,data){
    if(err){
      console.log('err:'+err);
      res.end();
      
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
console.log('change chat from posts, diction is',dict)
    
function contains(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] == obj) {
            return true;
        }
    }
    return false;}

    if (!(sid in dict)){
      let filename = 'cid_'+userID+'sid_'+add_id+'.txt';
      k = []
      fs.writeFile(filename,JSON.stringify(k),function(err){
        if(err){
          res.end()


        }
      })
      dict[sid] = {"cid":[add_id],"sid":[]};}
   
    if (!((contains(dict[sid]['cid'],userID)))) {
      let filename = './chat_record/cid_'+userID+'sid_'+add_id+'.txt';
      k = []
      fs.writeFile(filename,JSON.stringify(k),function(err){
        if(err){
          res.end()


        }
      })

        dict[sid]['cid'].push(userID);
      }
    
    if (!(cid in dict)){
      let filename = './chat_record/cid_'+userID+'sid_'+add_id+'.txt';
      k = []
      fs.writeFile(filename,JSON.stringify(k),function(err){
        if(err){
          res.end()


        }
      })

      dict[cid] = {"cid":[],"sid":[userID]};}
   
    if (!((contains(dict[cid]['sid'],add_id)))) {
      let filename = './chat_record/cid_'+userID+'sid_'+add_id+'.txt';
      k = []
      fs.writeFile(filename,JSON.stringify(k),function(err){
        if(err){
          res.end()


        }
      })

      dict[cid]['sid'].push(add_id);
      }
    
    dict = JSON.stringify(dict);
    console.log(dict);






    fs.writeFile('./chat_record/dialogue_relation.txt',dict,function(err){
            if(err){
              console.log('err:'+err);
              res.end();
            }
            else{
              console.log('successfully create a new dialogue in the post');
            }});
}});
  //res.redirect( "localhost:8081/chat2?cid="+cid+"&sid="+sid);
  formdb = require('../plugin/forumdb')
  formdb.add_negotiation_process(ui,si,ci);
  res.end()

})


module.exports = app;
