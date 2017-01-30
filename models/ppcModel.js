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

const WEEKLY_BUDGET_PERIOD = 'weekly';
const DAILY_BUDGET_PERIOD = 'daily';
const MONTHLY_BUDGET_PERIOD = 'monthly';


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
                    'url, title, address, lat, lng, phone_no, ad_text, ad_keyword_id) ' +
                    'VALUES ('+ searchData[i].ad_id +', '+ searchData[i].keyword_id +
                    ', '+ searchData[i].keyword_category_id +', '+ 
                    searchData[i].ad_location_id +','+ searchData[i].ad_subpage_id +','+ 
                    searchData[i].price +', '+ searchData[i].url +', '+ searchData[i].title + 
                    ','+ searchData[i].address +', '+ searchData[i].lat +', '+ searchData[i].lng + 
                    ','+ searchData[i].phone_no +','+ searchData[i].ad_text +',' + 
                    searchData[i].ad_keyword_id +');';
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

    trackSponsoredAdImpression : function(savedSearchIds, ip, userAgent, userId){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(function(connection){

                Util.getUserGroup(userId).then(
                    function(response){

                        var actor_type_id = getActorType(userId);

                        var query = '';
                        for(var i = 0; i<savedSearchIds.length; i++){
                            query += 'INSERT INTO ppc_analytics (item_type_id, activity_type_id, ' + 
                            'actor_type_id, item_id, actor_id, ip_address, user_agent, device_version) ' +
                            'VALUES ('+ ITEM_SPONSORED_AD +', '+ ACTIVITY_IMPRESSION +
                            ', '+ actor_type_id +', '+ savedSearchIds[i].insertId +
                            ', '+ userId +','+ ip +','+ userAgent.user_agent +','+ userAgent.device_version +');';
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

    trackDailyDealImpression : function(savedSearchIds, ip, userAgent, userId){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(function(connection){

                Util.getUserGroup(userId).then(
                    function(response){

                        var actor_type_id = getActorType(userId);

                        var query = '';
                        for(var i = 0; i<searchData.length; i++){
                            query += 'INSERT INTO ppc_analytics (item_type_id, activity_type_id, ' + 
                            'actor_type_id, item_id, actor_id, ip_address, user_agent, device_version) ' +
                            'VALUES ('+ ITEM_DAILY_DEAL +', '+ ACTIVITY_IMPRESSION +
                            ', '+ actor_type_id +', '+ searchData[i].deal_id +
                            ', '+ userId +','+ ip +','+ userAgent.user_agent +','+ userAgent.device_version +');';
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

    getAdSearchById : function(searchId){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(function(connection){
                var query = 'SELECT * FROM ppc_ad_searches WHERE id = ? LIMIT 1';
                connection.query(query, [searchId], function(err, results, fields){
                    connection.release();

                    if(err)
                        reject(err);

                    resolve(results.length > 0 ? results[0] : []);
                });

                
                
            },function(error){
                next(error);
            });
        });
    },

    requestMeetsClickPolicy: function(ip, userAgent){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(function(connection){
                var query = 'SELECT COUNT(id) FROM one_hour_analytics '+
                'WHERE ip_address = ? AND user_agent = ? AND device_version = ?';
                connection.query(query, 
                    [ip, userAgent.user_agent, userAgent.device_version], 
                    function(err, results, fields){
                    connection.release();

                    if(err)
                        reject(err);

                    resolve(results > 0 ? true : false);
                });

                
                
            },function(error){
                next(error);
            });
        });
    },

    saveFraudClick: function(ip, userAgent, userId){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(function(connection){
                var query = 'INSERT INTO fraud_clicks SET ?';
                userId = (undefined === userId ? null : userId);

                connection.query(query, 
                    {
                        ip_address: ip_address, 
                        user_agent: user_agent,
                        device_version: device_version,
                        user_id: userId
                    }, 
                    function(err, results, fields){
                    connection.release();

                    if(err)
                        reject(err);

                    resolve(results.insertId);
                });

                
                
            },function(error){
                next(error);
            });
        });
    },

    adBudgetLimitCheck: function(searchData){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(function(connection){
                var query = 'SELECT ' + 
                '(COUNT(ppc_analytics.id) * ?) + ? <= ppc_ads.budget_limit AS has_passed ' +
                'FROM ppc_ad_searches JOIN available_ad_keywords ON ' +
                'available_ad_keywords.ad_keyword_id = ppc_ad_searches.ad_keyword_id JOIN ppc_ads ON ' +
                'available_ad_keywords.ad_id = ppc_ads.id JOIN ppc_analytics ON ' +
                'ppc_ad_searches.id = ppc_analytics.item_id '+
                'WHERE ' +
                'ppc_ad_searches.id = ? AND ' +
                'IF(ppc_ads.budget_period = \'daily\', ppc_analytics.activity_date BETWEEN ' +
                'CURRENT_DATE() AND CURRENT_DATE(), ' +
                'ppc_analytics.activity_date BETWEEN ? AND ?)';


                connection.query(query, 
                    [
                        searchData.price, 
                        searchData.price, 
                        searchData.id, 
                        Util.firstDay(), 
                        Util.lastDay()
                    ], 
                    function(err, results, fields){
                    connection.release();

                    if(err)
                        reject(err);

                    if(results.length > 0 && results[0].has_passed !== 0){
                        resolve(true);
                    }

                    resolve(false);
                });

                
                
            },function(error){
                next(error);
            });
        });

    },

    postponeAdAvailability: function(ad_id, budget_period){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(function(connection){
                var query = 'UPDATE ppc_ads SET available_since = ? WHERE ppc_ads.id = ?';
                var queryParams;
                switch(budget_period){
                    case DAILY_BUDGET_PERIOD:
                        queryParams = 'DATE_ADD(available_since,INTERVAL 1 DAY)';
                        break;
                    case WEEKLY_BUDGET_PERIOD:
                        queryParams = 'DATE_ADD(available_since,INTERVAL 7 DAY)';
                        break;
                    case MONTHLY_BUDGET_PERIOD:
                        queryParams = 'DATE_ADD(available_since,INTERVAL 30 DAY)';
                        break;
                    default:
                        break;
                }

                connection.query(query, 
                    [queryParams], 
                    function(err, results, fields){
                    connection.release();

                    if(err)
                        reject(err);

                    resolve(results.affectedRows);
                });

                
                
            },function(error){
                next(error);
            });
        });
    }, 

    trackSponsoredAdClick : function(searchData, ip, userAgent, userId){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(function(connection){

                Util.getUserGroup(userId).then(
                    function(response){

                        var actor_type_id = getActorType(userId);
                      
                        var query = 'INSERT INTO ppc_analytics SET ?';


                        connection.query(query, 
                            {
                                actor_type_id: actor_type_id,
                                item_id: searchData.id,
                                actor_id: userId,
                                ip_address: ip,
                                user_agent: userAgent.user_agent,
                                device_version: userAgent.device_version
                            }, 
                            function(err, results, fields){
                            connection.release();

                            if(err)
                                reject(err);

                            resolve(results.insertId);
                        });
                    }, 
                    function(error){

                    }
                );

                
                
            },function(error){
                next(error);
            });
        });


    
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