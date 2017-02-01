var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var userAgent = require('useragent');
var expressValidator = require('express-validator')


var ads = require('./routes/ads');

var search = require('./routes/search');
var click = require('./routes/click');
var deal = require('./routes/deal');

var app = express();



//keeps RegExp library to be up to date to match with agent the 
//widest range of useragent
userAgent(true);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());

//Used to serve image assets and directory is outside project root
app.use(express.static(path.join(__dirname, '/../PPC_ASSETS')));

app.use('/api/', ads);

//Searches sponsored ads and daily deals
app.use('/api/search', search);

//Track clicks for sponsored ads and daily deals
app.use('/api/click', click);

//Daily Deals
app.use('/api/deals', deal);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error();
  err.message = 'Not Found.';
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  //Not Found pages
  if(err.status === 404){
    res.status(404);
    res.json({error: err});
  }

  else if(req.app.get('env') === 'production'){
    //Error in production environment
    res.status(err.status || 500);
    res.json('Something went wrong!');
  }
  else{
    //Error in non-production environment
    console.log(err);
    res.status(err.status || 500);
    res.json({error: err});
  }

});

module.exports = app;
