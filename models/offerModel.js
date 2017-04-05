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
    },

    getFlexOffersById : function(flexId){
        return new Promise(function(resolve, reject) {
            if(! flexId) return reject("Invalid Flex Id.");
            
            let query = 'SELECT iziphub_flexoffer_link.flexoffer_link_id,'+
                    'iziphub_flexoffer_link.flexoffer_link_content,'+
                    'iziphub_flexoffer_link.flexoffer_link_subpage_id,'+
                    'iziphub_flexoffer_link.flexoffer_link_featured,'+
                    'iziphub_flexoffer_link.flexoffer_link_subpage_id,'+
                    'iziphub_flexoffer_link.flexoffer_list_order,'+
                    'iziphub_flexoffer_link.flexoffer_list_order_asc,'+
                    'iziphub_flexoffer_link.flexoffer_name '+
                    'FROM iziphub_flexoffer_link WHERE flexoffer_link_id = ?';
            
            DbHelper.getConnection().then(
                function(connection){

                    connection.query(query, [parseInt(flexId)], function(err, rows, fields){
                        connection.release()

                        if(err)
                            return reject(err);

                        return resolve(
                            (rows.length > 0) ? rows[0]: null
                        );
                    });
                }, 
                function(error){
                    return reject(error);
                }
            );
                
        });
    }
}

module.exports = offerModel;