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

app.post('/entry', urlencodedParser, function (req, res) {
  if( !req.session.passport ){ res.redirect('/login'); }
  res.redirect('entry.html');
});


app.post('/evaluate',urlencodedParser, function (req, res) {
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

// interact with front-side
var io = require('socket.io')(server);
//count the number of online users
let counter = 0;
io.on('connection', (socket) => {
  counter++;
  io.emit("online", counter);
  socket.on("greet", () => {
      socket.emit("greet", counter);
  });
  socket.on("send", (msg) => {
	  //umpty input is not allowed
      if (Object.keys(msg).length < 2) return;
      io.emit("msg", msg);
  });
  socket.on('disconnect', () => {
      counter = (counter < 0) ? 0 : counter-=1;
      io.emit("online", counter);
  });
});
/**
* ----------------------------------------------
*/

app.use(function(request, response) {
  console.debug('-------------------------The request is:-----------------------')
  console.debug('head', request.headers)
  console.debug('body', request.body)
  console.log('----------------------------------------------------------------')
  response.status(404).render("404.ejs");
});
var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Address is http://%s:%s", host, port);
  console.log("server address: ", server.address())
});


