var express = require('express');
var app = express.Router();
var bodyParser = require('body-parser');
fs = require('fs');
var path = require('path');

var urlencodedParser = bodyParser.urlencoded({extended: false });
let http = require('http').Server(app);
let io = require('socket.io')(http);
app.use(bodyParser.json());
app.use(urlencodedParser);
app.use(express.static(path.join('.','public')));
var cookieParser = require('cookie-parser');


app.use('/', urlencodedParser, function (req, res) {
  //console.debug(req.body)
  let userID = req.cookies.islogin.sid; 
  console.log('redirect ot chat function'+ userID);
  res.cookie('userID',userID,{maxAge:1000*3600});
  if( !req.session.passport ){ res.redirect('/login'); }

  res.redirect('/chat.html');
});



module.exports = app;