"use strict";
var express = require('express');
var session = require('express-session');
var http = require('http');
var app = express();
var sess;
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var url = require('url');
var cors = require('cors');
var host = "localhost";
var port = 9000;

console.log("Server info", host, port);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'Somethignsomething1234!test',
  resave: true,
  saveUninitialized: true
}));


// Enable CORS preflight across the board.
app.options('*', cors());
app.use(cors());
app.use(express.static(__dirname + '/app/build/'));

///////////  Configure Webserver  ///////////
app.use(function(req, res, next) {
  var keys;
  console.log('------------------------------------------ incoming request ------------------------------------------');
  console.log('New ' + req.method + ' request for', req.url);
  req.bag = {}; //create my object for my stuff
  req.session.count = eval(req.session.count) + 1;
  req.bag.session = req.session;

  var url_parts = url.parse(req.url, true);
  req.parameters = url_parts.query;
  keys = Object.keys(req.parameters);
  if (req.parameters && keys.length > 0) console.log({
    parameters: req.parameters
  }); //print request parameters
  keys = Object.keys(req.body);
  if (req.body && keys.length > 0) console.log({
    body: req.body
  }); //print request body
  next();
});


////////////// Error Handling //////////////
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use(function(err, req, res, next) {
  console.log("Error Handler -", req.url, err);
  var errorCode = err.status || 500;
  res.status(errorCode);
  req.bag.error = {
    msg: err.stack,
    status: errorCode
  };
  if (req.bag.error.status == 404) req.bag.error.msg = "Sorry, I cannot locate that file";
  //res.render('template/error', {bag: req.bag});
  res.send({
    "message": err
  })
});

var server = http.createServer(app).listen(port, function() {

});
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
process.env.NODE_ENV = 'production';

server.timeout = 2400000; // Ta-da.
console.log('------------------------------------------ Server Up - ' + host + ':' + port + ' ------------------------------------------');

// Track the application deployments
require("cf-deployment-tracker-client").track();
