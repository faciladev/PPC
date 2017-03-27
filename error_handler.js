var Promise = require('bluebird');
var logger = require('./logger');

//Centralized error handler 

function errorHandler(){

		//Log error and return if error is operational or not.
		this.handleError = function(error){
			return new Promise(function(resolve, reject){
			 	try{
			 		//Log error to console and file
			 		logger.error(error);
				 	resolve(error.isOperational);
			 	}	catch(err){
				 	reject(err);
			 	}

			});
		}

		//Log error and exit process if exitcode is provided or
		//Log error and run callback instead
		this.handleErrorAndExit = function(error, exitCodeOrCallback, level)
		{
			level = level || 'error';
			logger.log_and_exit(level, error, exitCodeOrCallback);
		}

}

module.exports = new errorHandler();



