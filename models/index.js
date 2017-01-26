var mysql = require('mysql');
var Promise = require('promise');

var DbHelper = require('../lib/DbHelper');
var connectionPool = DbHelper.connectionPool;

var Index = {

    findAllTests : function(){
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                connection.query('SELECT * FROM test',
                    function (err, rows, fields) {
                        //Release connection
                        connection.release();

                        if(err){
                            reject(err);
                        }


                        resolve(rows);
                    }
                );
            }, function(error){
                if(error)
                    reject(new Error('Connection error'));
            });

            
        });
    }
}

module.exports = Index;