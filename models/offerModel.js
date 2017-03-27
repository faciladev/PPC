var Promise = require('bluebird');

var DbHelper = require('../lib/DbHelper');
var Util = require('../lib/util');


var offerModel = {

    getAllByAdvertiser: function(advertiserId){
        return new Promise(function(resolve, reject) {
          
            DbHelper.getConnection().then(function(connection){
                
                connection.query(
                    'SELECT * FROM ppc_offers JOIN ppc_ad_offers ON ppc_offers.id = ppc_ad_offers.offer_id JOIN ppc_ads ON ppc_ads.id = ppc_ad_offers.ad_id WHERE ppc_ads.is_approved = 1 AND ppc_ads.advertiser_id = ?', [advertiserId], 
                    function (err, rows, fields) {
                        
                        //release connection
                        connection.release();

                        if(err){
                            return reject(err);
                        }
                        resolve(rows);
                            
                    }
                );
            }, function(error){
                reject(error);
            });

            
        });
    }
}

module.exports = offerModel;