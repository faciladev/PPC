var Promise = require('bluebird');

var DbHelper = require('../lib/DbHelper');
var Util = require('../lib/util');

var businessModel = {
	

    getByAdvertisers: function(advertiserId){
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                
                connection.query(
                    'SELECT * FROM advertiser_business ' +
                    'WHERE advertiser_id = ? ', [advertiserId], 
                    function (err, rows, fields) {
                        //release connection
                        connection.release();

                        if(err){
                            return reject(err);
                        }

                        if(rows.length <= 0)
                            return resolve([]);

                        resolve(rows[0]);
                    }
                );
            }, function(error){
                reject(error);
            });

            
        });
    }
}

module.exports = businessModel;