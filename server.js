/* ref: https://github.com/LI-YUXIN-Ryan-Garcia/CUPar-CSCI3100-Project.git */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var engines = require('consolidate');
var path = require('path');
app.engine('html', engines.swig);
app.set('view engine', 'html');
// create application/x-www-form-urlencoded coding analyze
var urlencodedParser = bodyParser.urlencoded({extended: false });
app.use(bodyParser.json());
app.use(urlencodedParser);
app.use(express.static(path.join('.','public')));

// set favourite icon for the website
var favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname, 'keyboarder.ico')));

// options for cookie and session
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser("UBuy"));
app.use(session({
     secret: 'UBuy is the best', 
     resave: true,  // resave session
     key: 'UBuy deserves an A',
     cookie: { maxAge: 2 * 3600 * 1000},  // expired time
     saveUninitialized: false // passport: true, session: false
}));

// apply authentication for all access request
var user = require('./models/user.js');
app.use(user.authenticate);

//invoke  router
var index =require('./routes/index');
var login = require('./routes/login');
var signup = require('./routes/signup');
var logout = require('./routes/logout');/*
var deleteAccount = require('./routes/deleteAccount');*/
var account = require('./routes/account');
var process_buyer = require('./routes/process_buyer');
var process_seller = require('./routes/process_seller');
var check_buyer = require('./routes/check_buyer');
var check_seller = require('./routes/check_seller');
var result_buyer = require('./routes/result_buyer');
var result_seller = require('./routes/result_seller');
var process_evaluate = require('./routes/process_evaluate');
var chat = require('./routes/chat');
var show = require('./routes/show');


app.use("/", index);
app.use("/login", login);
app.use('/signup', signup);
app.use('/logout', logout);/*
app.use('/deleteAccount', deleteAccount);*/
app.use('/account_page', account);
app.use('/process_buyer', process_buyer);
app.use('/process_seller', process_seller);
app.use('/check_buyer', check_buyer);
app.use('/check_seller', check_seller);
app.use('/result_buyer', result_buyer);
app.use('/result_seller', result_seller);
app.use('/process_evaluate', process_evaluate);
app.use('/chat', chat);
app.use('/show',show);

/**
* ----------------------------------------------
*/


app.get('/Buyer', urlencodedParser, function (req, res) {
  if( !req.session.passport ){ res.redirect('/login'); }
  let user_name = req.cookies.islogin.name;
  res.render('Buyer.hbs', {
    layout: null,
    username: user_name,
    login: 1
  });
});

app.get('/Seller', urlencodedParser, function (req, res) {
  
  if( !req.session.passport ){ res.redirect('/login'); }
  let user_name = req.cookies.islogin.name;
  res.render('Seller.hbs', {
    layout: null,
    username: user_name,
    login: 1
  });
});




app.post('/evaluate', function (req, res) {
  if( !req.session.passport ){ res.redirect('/login'); }
  res.redirect('evaluate.html');
});



var forum = require('./routes/forum');
app.use('/forum',forum);
var post = require('./routes/post');
app.use('/post',post);
/**
* ----------------------------------------------
*/
//zhangchi and yangliu's job
/*
app.use('/chat', urlencodedParser, function (req, res) {
  //console.debug(req.body)
  let userID = req.cookies.islogin.sid; 
  console.log('redirect ot chat function'+ userID);
  res.cookie('userID',userID,{maxAge:1000*3600});

  fs.readFile('./所有的文章.txt','utf8',function(err,data){
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
      //var lastArr = JSON.parse(r);

      res.write(r);
      res.end();
      //var d = data.replace('‘','"');
      //var c = d.replace('’','"');
      //console.log(JSON.parse(c));
      //console.log(JSON.parse(data));
      //console.log(eval('('+data+')'));
    }
  });


  if( !req.session.passport ){ res.redirect('/login'); }
  res.sendFile(__dirname+'/chat.html');
});
*/
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.get('/chat1',urlencodedParser, function (req, res) {
    console.log('the requesit is')
    console.log(req.query.cid);
    fs.readFile('./all_dialogues.txt','utf8',function(err,data){
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
      //var lastArr = JSON.parse(r);

      res.write(r);
      res.end();
      //var d = data.replace('‘','"');
      //var c = d.replace('’','"');
      //console.log(JSON.parse(c));
      //console.log(JSON.parse(data));
      //console.log(eval('('+data+')'));
    }
  });
    res.sendFile(__dirname+'/client.html'); 
})
app.get('/chat2', function (req, res) {
    res.sendFile(__dirname+'/service.html');
})

// socket连接对象，键名：cid****_sid***、sid****_cid****（前面为发送方，后面为接收方）
let localSockets = {}

class Chat {
    constructor(socket, chatInfo) {
        this.socket = socket
        this.chatInfo = chatInfo
    }

    isCustomerSender() {
        if (this.chatInfo.customer && this.chatInfo.customer.isSender === true) {
            return true
        } else {
            return false
        }
    }

    getSocketKeyValue() {
        // 客户是发送消息方，客服是接收消息方
        if (this.isCustomerSender()) {
            return {
                key: `cid${this.chatInfo.customer.id}_sid${this.chatInfo.service.id}`,
                val: this.socket
            }
        } else {
            return {
                key: `sid${this.chatInfo.service.id}_cid${this.chatInfo.customer.id}`,
                val: this.socket
            }
        }
    }
}

class Message {
    constructor(req){
        this.req = req
        this.userInfo = this.req.userInfo || {}
        this.msg = this.req.msg || ''
    }
    getSenderKey(){
        if(this.userInfo.customer.isSender){
            return `cid${this.userInfo.customer.id}`
        } else {
            return `sid${this.userInfo.service.id}`
        }
    }
    getReceiverKey(){
        if(this.userInfo.customer.isSender){
            return `sid${this.userInfo.service.id}`
        } else {
            return `cid${this.userInfo.customer.id}`
        }
    }
    send(){
        if(localSockets[`${this.getSenderKey()}_${this.getReceiverKey()}`]){
            localSockets[`${this.getSenderKey()}_${this.getReceiverKey()}`].emit('callback private message', {
                msg: this.msg,
                self: true
            })
        }
        if(localSockets[`${this.getReceiverKey()}_${this.getSenderKey()}`]){
            localSockets[`${this.getReceiverKey()}_${this.getSenderKey()}`].emit('callback private message', {
                msg: this.msg,
                self: false
            })
        }
    }
}

io.on('connect', function (socket) {
    socket.on('new chat', function (chatInfo) {
        let newChatObj = new Chat(socket, chatInfo)
        let newSocket = newChatObj.getSocketKeyValue()

        // 若重复登录，断开原连接
        if(newSocket.key in localSockets){
            localSockets[newSocket.key].disconnect(true)
        }

        // 设置新连接
        localSockets[newSocket.key] = newSocket.val
    })
    socket.on('send private message', function(req){
        let msgObj = new Message(req)
        console.log('send private message', req);
        msgObj.send()
    })
})

/**
* ----------------------------------------------



var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Address is http://%s:%s", host, port);
  console.log("server address: ", server.address())
});
var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Address is http://%s:%s", host, port);
  console.log("server address: ", server.address())
});
*/


app.use(function(request, response) {
  //console.debug('-------------------------The request is:-----------------------')
  //console.debug('head', request.headers)
  //console.debug('body', request.body)
  //console.log('----------------------------------------------------------------')
  response.status(404).render("404.ejs");
});
http.listen(8081, () => console.log('begin to test the app'))
