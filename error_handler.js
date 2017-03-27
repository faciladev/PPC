var Promise = require('bluebird');
var logger = require('./logger');

//Centralized error handler 
//Return if error is operational Error or not.
function errorHandler(){
	
	 this.handleError = function(error, callback){
	 	var isOperational = processError(error);
	 	return callback(isOperational);
	 },

	 this.handleErrorAsync = function(error){
	 	return new Promise(function(resolve, reject){
		 	try{
		 		var isOperational = processError(error);

			 	resolve(isOperational);

			 }	catch(err){
			 	reject(err);
			 }

	 	})
	 }

	 this.isTrustedError = function(error, callback)
	 {
	 	return callback(error.isOperational);
	 }

}

var processError = function(error){
	var severe = error.severe || false;
	//Log error to console and file
	logger.error(error);

 	return error.isOperational;
}

module.exports = new errorHandler();



