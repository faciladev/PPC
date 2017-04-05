var CronJob = require('cron').CronJob;
var moment = require('moment-timezone');
var logger = require('../logger');
var Mailer = require('../lib/node_mailer');
var jsonfile = require('jsonfile');
var config = require('config');

var file = config.get('log_path') + '/log-email.json';

var timezone = 'America/Los_Angeles';
var env = process.env.NODE_ENV || "development";
var port = process.env.PORT || 3003;


var EmailLogJob = new CronJob({
	//Run cron job every 30 seconds
	cronTime: '0,30 0-59 * * * *',
	onTick: function(){

		var options = {
			//start reading log from the last 31 seconds
		    from: moment.tz(new Date - 31000, timezone).format(),    
		    until: moment.tz(new Date, timezone).format(),    
		    start: 0,
		    order: 'desc',
		    rows: 1000000
		};

		logger.query(options, function (err, results) {
		    if(err){
		        logger.error(err);
		        return;
		    }

		    if(results.file.length <= 0)
		    	return;

		    var bugs = [];
		    results.file.forEach(function(f){
		    	if(f.isOperational)
		    		return;

		    	bugs.push(f);
		    });

		    if(bugs.length === 0)
		    	return;

		    let body = '';
		    bugs.forEach(function(bug){
		    	body += '<h2>' + bug.message + '</h2>';
		    	body += '<p>' + bug.stack;
		    	body += '<br> <small> Date: <b>' + bug.timestamp + '</b></small></p>';
		    });



		    jsonfile.writeFile(file, bugs, function(err) {
			  if(err){
			  	return logger.error(err);
			  } else {
			  	Mailer.sendMail({
						from: 'PPC CRON JOB',
						to: 'abbifa@gmail.com',
						subject: 'PPC Fatal Error Report',
						html: body
				    }, (error, info) => {
					    if (error) {
					        return console.error(error);
					    }
					}
				);
			  }
			});

		});
	},
	start: true,
	timeZone: timezone
});

EmailLogJob.start();