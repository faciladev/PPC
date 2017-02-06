var Promise = require('promise');

var DbHelper = require('../lib/DbHelper');
var Util = require('../lib/util');

var advertiserModel = {
	

    getAdvertisers: function(){
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){

                connection.query(
                    'SELECT advertizer_id, advertizer_business_name FROM advertisers ' +
                    'WHERE advertizer_deleted = 0 AND advertizer_approved = 1', 
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