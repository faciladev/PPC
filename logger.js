var winston = require('winston');
var moment = require('moment-timezone');

var timezone = 'America/Los_Angeles';
var config = {
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    data: 3,
    info: 4,
    verbose: 5,
    silly: 6
  },
  colors: {
    error: 'red',
    debug: 'blue',
    warn: 'yellow',
    data: 'grey',
    info: 'green',
    verbose: 'cyan',
    silly: 'magenta'
  }
};

var logger = module.exports = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        colorize: true,
        timestamp: moment.tz(new Date, timezone).format()
      }),
      new (winston.transports.File)(
        { level: 'error', 
          filename: 'logs/log-error.log',
          timestamp: moment.tz(new Date, timezone).format()
        }
      )
    ],
    levels: config.levels,
    colors: config.colors
  }
);
