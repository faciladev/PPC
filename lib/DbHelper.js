var mysql = require('mysql');
var Promise = require('promise');
var config = require('config');

var dbConfig = config.get('db');

//Enable multiple statements
dbConfig.multipleStatements = true;
//Create connection pool
var connectionPool = mysql.createPool(dbConfig);

// connectionPool.on('connection', function (connection) {
//   console.log('Connection %d created', connection.threadId);
//   console.log('number of connections: ' + connectionPool._allConnections.length);
// });

// connectionPool.on('release', function (connection) {
//   console.log('Connection %d released', connection.threadId);
// });

// connectionPool.on('acquire', function (connection) {
//   console.log('Connection %d acquired', connection.threadId);
// });

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
	}
}

module.exports = DbHelper;