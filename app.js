var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var userAgent = require('useragent');
var expressValidator = require('express-validator');
var fileUpload = require('express-fileupload');
var cors = require('cors');
var config = require('config');


var ads = require('./routes/ads');
var search = require('./routes/search');
var click = require('./routes/click');
var download = require('./routes/download');
var deal = require('./routes/deal');
var offer = require('./routes/offer');
var index = require('./routes/index');

var app = express();

//keeps RegExp library to be up to date to match with agent the 
//widest range of useragent
userAgent(true);

//CORS configuration
var whitelist = config.get('cors_whitelist');
var corsOptionsDelegate = function(req, callback){
    var corsOptions;
    if(whitelist.indexOf(req.header('Origin')) !== -1){
        corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
    }else{
        corsOptions = { origin: false }; // disable CORS for this request
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
};
app.use(cors(corsOptionsDelegate));

//Enable pre-flight mode
app.options('*', cors()) 

app.use(logger('dev'));
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());

//Used to serve image assets and directory is outside project root
app.use(express.static(path.join(__dirname, '/../PPC_ASSETS')));

//Sponsored ad api
app.use('/api/ads', ads);

//Searches sponsored ads and daily deals
app.use('/api/search', search);

//Track clicks for sponsored ads and daily deals
app.use('/api/click', click);

//Searches sponsored ads and daily deals
app.use('/api/download', download);

//Daily Deals
app.use('/api/deals', deal);

//Offer
app.use('/api/offers', offer);

//Other miscellaneous api
app.use('/api/', index);

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
