var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var userAgent = require('useragent');
var expressValidator = require('express-validator');
var fileUpload = require('express-fileupload');
var cors = require('cors');
var config = require('config');
var morgan = require('morgan');
var compression = require('compression');
var helmet = require('helmet');

var errorHandler = require('./error_handler');
var appError = require('./app_error');
var logger = require('./logger');


var ads = require('./routes/ads');
var search = require('./routes/search');
var click = require('./routes/click');
var download = require('./routes/download');
var deal = require('./routes/deal');
var offer = require('./routes/offer');
var analytic = require('./routes/analytic');
var index = require('./routes/index');
var logs = require('./routes/logs');

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

//Adds security layer
app.use(helmet());

app.use(compression());
app.use(cors(corsOptionsDelegate));

//Enable pre-flight mode
app.options('*', cors()); 
//logger for non-production environments only
app.get("env") !== "production" && app.use(morgan('dev'));
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());

//Used to serve image assets and directory is outside project root
app.use(express.static(config.get('upload_path')));

//Apidoc 
app.use('/apidoc', express.static(config.get('apidoc')));

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

//Analytics
app.use('/api/analytics', analytic);

//Other miscellaneous api
app.use('/api/', index);

app.use('/logs/', logs);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(appError.HttpErrorCodes.NotFound);
  res.json({error: "Page Not Found"});
});


if (!('toJSON' in Error.prototype))
Object.defineProperty(Error.prototype, 'toJSON', {
    value: function () {
        var alt = {};

        Object.getOwnPropertyNames(this).forEach(function (key) {
            if(key !== "stack")
              alt[key] = this[key];
        }, this);

        return alt;
    },
    configurable: true,
    writable: true
});

// Error handler middleware
app.use(function(err, req, res, next) {

  //Delegate express default error handler
  //for errors that occur when 
  //headers have already been sent to the client
  if (res.headersSent) {
      return next(err)
  }

  errorHandler.handleError(err).then(
    function(isOperationalError){

      if(! isOperationalError){
        res.status(appError.HttpErrorCodes.InternalServerError);
      } else {
        res.status(err.httpErrorCode);
      }

      if(req.app.get('env') === 'production')
        err = "Something went wrong.";

      res.json({error: err});

    }, function(error){
      //Next to express default error handler
      next(error);
    });

});


module.exports = app;
