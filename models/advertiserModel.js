var Promise = require('promise');

var DbHelper = require('../lib/DbHelper');
var Util = require('../lib/util');

//Approved advertiser status code
const STATUS_APPROVED = 4;

var advertiserModel = {
	

    getAdvertisers: function(){
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                
                connection.query(
                    'SELECT advertizer_id, advertizer_business_name FROM advertisers ' +
                    'WHERE advertizer_deleted = 0 AND advertizer_status = ' + STATUS_APPROVED, 
                    function (err, rows, fields) {

                        //release connection
                        connection.release();

                        if(err){
                            reject(err);
                        }


                        resolve(rows);
                    }
                );
            }, function(error){
                if(error)
                    reject(error);
            });

            
        });
    }
}

module.exports = advertiserModel;