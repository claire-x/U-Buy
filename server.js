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
app.use(express.static(path.join('.', 'public')));

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
var logout = require('./routes/logout');
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
var admin_login = require('./routes/admin_login');
var admin_account = require('./routes/admin_account');
var admin_reset = require('./routes/admin_reset');
var user_profile = require('./routes/user_profile');


// profile photo upload
const initRoutes = require("./routes/web");
global.__basedir = __dirname;

app.use(express.urlencoded({ extended: true }));
initRoutes(app);

const db = require("./models");
db.sequelize.sync({ force: true }).then(() => {
    console.log("Drop and re-sync db.");
});

// Item photo upload
const initRoutes2 = require("./routes/ItemPhoto");
global.__basedir = __dirname;

app.use(express.urlencoded({ extended: true }));
initRoutes2(app);


app.use("/", index);
app.use("/login", login);
app.use('/signup', signup);
app.use('/logout', logout);
app.use('/account_page', account);
app.use('/process_buyer', process_buyer);
app.use('/process_seller', process_seller);
app.use('/check_buyer', check_buyer);
app.use('/check_seller', check_seller);
app.use('/result_buyer', result_buyer);
app.use('/result_seller', result_seller);
app.use('/process_evaluation', process_evaluate);
app.use('/chat', chat);
app.use('/show', show);
app.use('/admin_login', admin_login);
app.use('/admin_account_page', admin_account);
app.use('/admin_reset', admin_reset);
app.use('/user_profile', user_profile);


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
        this.cid = this.userInfo.customer.id
        this.sid = this.userInfo.service.id
        this.sender = ""
        if(this.userInfo.customer.isSender){this.sender = "cid"}
        else{this.sender = "sid"}
        

    }
    getSenderKey(){
        let sender = "";
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
        
        let cid = msgObj.cid.toString()
        let sid = msgObj.sid.toString()
        
        let filename = './chat_record/cid_'+cid+'sid_'+sid+'.txt'
        fs.readFile(filename,'utf8',function(err,data){
                let sender = msgObj.sender
                console.log('successfully opened the file sender is',sender)
                if(err){
                    console.log('err is:'+err)
                }
                else{
                    k = JSON.parse(data)
                    z = []
                    z.push(sender) 
                    z.push(msgObj.msg)
                    k.push(z)
                    k = JSON.stringify(k)
                    fs.writeFile('./chat_record/cid_'+cid+'sid_'+sid+'.txt',k,function(err){
                        if(err){console.log('the data recourd addition err:'+err);}
                        else{console.log('succeed to add the data',k)}
                    })

                }
            });
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