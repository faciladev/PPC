var mysql = require('mysql');
var Promise = require('promise');
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
	}
}

module.exports = DbHelper;