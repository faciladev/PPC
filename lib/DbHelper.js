var mysql = require('mysql');
var Promise = require('bluebird');
var config = require('config');

var dbConfig = config.get('db');

//Enable multiple statements
dbConfig.multipleStatements = true;
//Create connection pool
var connectionPool = mysql.createPool(dbConfig);

var DbHelper = {
	getConnection: function(){
		return new Promise(function(resolve, reject) {
			
			connectionPool.getConnection(function (err, connection) {
				if(err)
					return reject(err);

				resolve(connection);
			});
		});
	},
	
	prepare: function(sql, inserts){
		return mysql.format(sql, inserts);
	},

	closeAllConnections: function(){
		return new Promise(function(resolve, reject){
			connectionPool.end(function (err) {
			  if(err)
			  	return reject(err);

			  resolve(true);
			});
		});
		
	}
}

module.exports = DbHelper;