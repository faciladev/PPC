var Promise = require('promise');

var DbHelper = require('../lib/DbHelper');
var Util = require('../lib/util');

const ACTIVITY_IMPRESSION = 2;

const ITEM_SPONSORED_AD = 1;
const ITEM_DAILY_DEAL = 2;

const ACTOR_CONSUMER = 1;
const ACTOR_ADVERTISER = 2;
const ACTOR_NON_MEMBER = 3;
const ACTOR_ADMIN = 4;

var ppcModel = {

    findSponsoredAds : function(keyword, location, subpage){

        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                //set default argument value
                var subpage = (undefined === subpage) ? false : subpage;

                var query = 'SELECT ' +
                'available_ad_keywords.ad_keyword_id, '+ 
                // 'usa_states.usa_state_code, ' +
                'ppc_ads.id AS ad_id, ' +
                'ppc_ads.url, ' +
                'ppc_ads.title, ' +
                'ppc_ads.address, ' +
                'ppc_ads.lat, ' +
                'ppc_ads.lng, ' +
                'ppc_ads.phone_no, ' +
                'ppc_ads.ad_text, ' +
                'ppc_keywords.price, ' +
                'available_ad_keywords.keyword_id ' +
                'FROM ' +
                'available_ad_keywords ' +
                'JOIN ' +
                'ppc_keywords ON available_ad_keywords.keyword_id = ppc_keywords.id ' +
                'JOIN ' + 
                'ppc_ads ON ppc_ads.id = available_ad_keywords.ad_id ' +
                'JOIN ' +
                'ppc_ad_locations ON ppc_ads.id = ppc_ad_locations.ad_id ';

                if(subpage)
                    query += 'JOIN ppc_ads_subpages ON ppc_ads.id = ppc_ads_subpages.ad_id';


                query += 'WHERE ' +
                'ppc_keywords.keyword LIKE ? AND (ppc_ad_locations.city LIKE ? ' + 
                'OR ppc_ad_locations.zip_code LIKE ?) AND ppc_ads.is_approved = 1 ' +
                'AND ppc_ads.is_deleted = 0 ';

                if(subpage)
                    query += 'AND ppc_ads_subpages.sub_page_id = ? ';

                query += 'ORDER BY ppc_keywords.price DESC';

                var queryParams = ['%' + keyword + '%', '%' + location + '%', '%' + location + '%'];
                
                if(subpage)
                    queryParams.push(subpage);

                connection.query(
                    query, 
                    queryParams,
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
    },

    saveSponsoredAdSearch : function(searchData){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(function(connection){

                if(searchData.length <= 0)
                    reject(new Error('Cannot save empty search result.'));

                var query = '';

                for (var i = 0; i < searchData.length; i++) {
                    query += 'INSERT INTO ppc_ad_searches (ad_id, keyword_id, ' + 
                    'keyword_category_id, ad_location_id, ad_subpage_id, price, ' +
                    'url, title, address, lat, lng, phone_no, ad_text) ' +
                    'VALUES ('+ searchData[i].ad_id +', '+ searchData[i].keyword_id +
                    ', '+ searchData[i].keyword_category_id +', '+ 
                    searchData[i].ad_location_id +','+ searchData[i].ad_subpage_id +','+ 
                    searchData[i].price +', '+ searchData[i].url +', '+ searchData[i].title + 
                    ','+ searchData[i].address +', '+ searchData[i].lat +', '+ searchData[i].lng + 
                    ','+ searchData[i].phone_no +','+ searchData[i].ad_text +');';
                }

                //Run multiple statement query
                connection.query(query, function(err, results, fields){
                    if(err)
                        reject(err);

                    resolve(results);
                });

            },function(error){
                next(error);
            });
        });
    },

    trackSponsoredAdImpression : function(savedSearchIds, ip, userId){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(function(connection){

                Util.getUserGroup(userId).then(
                    function(response){

                        var actor_type_id = getActorType(userId);

                        var query = '';
                        for(var i = 0; i<savedSearchIds.length; i++){
                            query += 'INSERT INTO ppc_analytics (item_type_id, activity_type_id, ' + 
                            'actor_type_id, item_id, actor_id, ip_address) ' +
                            'VALUES ('+ ITEM_SPONSORED_AD +', '+ ACTIVITY_IMPRESSION +
                            ', '+ actor_type_id +', '+ savedSearchIds[i].insertedId +
                            ', '+ userId +','+ ip +');';
                        }

                        connection.query(query, function(err, results, fields){
                            connection.release();

                            if(err)
                                reject(err);

                            resolve(results);
                        });
                    }, 
                    function(error){

                    }
                );

                
                
            },function(error){
                next(error);
            });
        });
    },

    findDailyDeals : function(keyword){

        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                //set default argument value
                var subpage = (undefined === subpage) ? false : subpage;

                var query = 'SELECT dd.id AS deal_id, m.id AS microsite_id, m.name, m.company_name, m.what_you_get, m.location,' +
                    'm.end_date, m.discount_daily_description, m.discount_type, m.discount_percentage, m.discount_description, ' +
                    'm.regular_price, m.discount_rate, dd.coupon_name, dd.coupon_generated_code, m.image, dd.deal_image, ' +
                    'm.discount_description, m.daily_deal_description, m.approved_category FROM daily_deal AS dd LEFT JOIN daily_deal_microsite ' +
                    'AS m ON dd.daily_deal_microsite_id=m.id ' +
                    'WHERE m.is_deleted=0 AND m.is_approved=1 AND m.is_complete=1 ' + 
                    'AND dd.available_since <= CURDATE() AND m.name LIKE ?';

                var queryParams = ['%' + keyword + '%'];

                connection.query(
                    query, 
                    queryParams,
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
    },

    trackDailyDealImpression : function(savedSearchIds, ip, userId){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(function(connection){

                Util.getUserGroup(userId).then(
                    function(response){

                        var actor_type_id = getActorType(userId);

                        var query = '';
                        for(var i = 0; i<searchData.length; i++){
                            query += 'INSERT INTO ppc_analytics (item_type_id, activity_type_id, ' + 
                            'actor_type_id, item_id, actor_id, ip_address) ' +
                            'VALUES ('+ ITEM_DAILY_DEAL +', '+ ACTIVITY_IMPRESSION +
                            ', '+ actor_type_id +', '+ searchData[i].deal_id +
                            ', '+ userId +','+ ip +');';
                        }

                        connection.query(query, function(err, results, fields){
                            connection.release();

                            if(err)
                                reject(err);

                            resolve(results);
                        });
                    }, 
                    function(error){

                    }
                );

                
                
            },function(error){
                next(error);
            });
        });
    },

    


    
}

var getActorType = function(userId){
    var actor_type_id;
    if(response.group_id === 1){
        actor_type_id = ACTOR_ADMIN;
    }
    else if(response.group_id === 2){
        actor_type_id = ACTOR_CONSUMER;
    } else if(response.group_id === 3){
        actor_type_id = ACTOR_ADVERTISER;
    } else {
        actor_type_id = ACTOR_NON_MEMBER;
    }
    return actor_type_id;
}


module.exports = ppcModel;