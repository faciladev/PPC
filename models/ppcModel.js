var Promise = require('promise');
var config = require('config');

var DbHelper = require('../lib/DbHelper');
var PaginationHelper = require('../lib/PaginationHelper');
var Util = require('../lib/util');
var userModel = require('./userModel');

const ACTIVITY_CLICK = 1;
const ACTIVITY_IMPRESSION = 2;
const ACTIVITY_DOWNLOAD = 3;

const ITEM_SPONSORED_AD = 1;
const ITEM_DAILY_DEAL = 2;
const ITEM_FLEX_OFFER = 3;

const ACTOR_CONSUMER = 1;
const ACTOR_ADVERTISER = 2;
const ACTOR_NON_MEMBER = 3;
const ACTOR_ADMIN = 4;

const WEEKLY_BUDGET_PERIOD = 'weekly';
const DAILY_BUDGET_PERIOD = 'daily';
const MONTHLY_BUDGET_PERIOD = 'monthly';



var ppcModel = {

    ACTIVITY_CLICK : ACTIVITY_CLICK,
    ACTIVITY_IMPRESSION : ACTIVITY_IMPRESSION,
    ACTIVITY_DOWNLOAD : ACTIVITY_DOWNLOAD,

    ITEM_SPONSORED_AD : ITEM_SPONSORED_AD,
    ITEM_DAILY_DEAL : ITEM_DAILY_DEAL,
    ITEM_FLEX_OFFER : ITEM_FLEX_OFFER,

    ACTOR_CONSUMER : ACTOR_CONSUMER,
    ACTOR_ADVERTISER : ACTOR_ADVERTISER,
    ACTOR_NON_MEMBER : ACTOR_NON_MEMBER,
    ACTOR_ADMIN : ACTOR_ADMIN,

    WEEKLY_BUDGET_PERIOD : WEEKLY_BUDGET_PERIOD,
    DAILY_BUDGET_PERIOD : DAILY_BUDGET_PERIOD,
    MONTHLY_BUDGET_PERIOD : MONTHLY_BUDGET_PERIOD,

    findSponsoredAds : function(keyword, location, subPage, page){
        return new Promise(function(resolve, reject) {
            //set default argument value
            subPage = (typeof subPage === 'undefined' || subPage === null) 
                ? false : subPage;

            var query = 'SELECT ' +
            'available_ad_keywords.ad_keyword_id, '+ 
            'usa_states.usa_state_code, ' +
            'usa_states.usa_state_name, ' +
            'ppc_ad_microsites.city, ' +
            'ppc_ad_microsites.zipcode, ' +
            'ppc_ads.id AS ad_id, ' +
            'ppc_ads.url, ' +
            'ppc_ads.title, ' +
            'ppc_ads.address, ' +
            'ppc_ads.lat, ' +
            'ppc_ads.lng, ' +
            'ppc_ads.phone_no, ' +
            'ppc_ads.ad_text, ' +
            'ppc_keywords.price, ' +
            'available_ad_keywords.keyword_category_id,' +
            'ppc_ad_locations.id AS ad_location_id, ' +
            'sub_page.sub_page_id AS ad_subpage_id, ' +
            'available_ad_keywords.keyword_id ' +
            'FROM ' +
            'available_ad_keywords ' +
            'JOIN ' +
            'ppc_keywords ON available_ad_keywords.keyword_id = ppc_keywords.id ' +
            'JOIN ' + 
            'ppc_ads ON ppc_ads.id = available_ad_keywords.ad_id ' +
            'JOIN ' +
            'ppc_ad_microsites ON ppc_ad_microsites.ad_id = ppc_ads.id '+
            'JOIN ' +
            'usa_states ON usa_states.usa_state_id = ppc_ad_microsites.state ' +
            'JOIN ' +
            'ppc_ad_locations ON ppc_ads.id = ppc_ad_locations.ad_id ' +
            'JOIN ' +
            'ppc_ads_subpages AS sub_page ON ppc_ads.id = sub_page.ad_id '
            ;

            if(subPage)
                query += 'JOIN ppc_ads_subpages ON ppc_ads.id = ppc_ads_subpages.ad_id ';


            query += 'WHERE ' +
            'ppc_keywords.keyword LIKE ? AND (ppc_ad_locations.city LIKE ? ' + 
            'OR ppc_ad_locations.zip_code LIKE ? ) AND ppc_ads.is_approved = 1 ' +
            'AND ppc_ads.is_deleted = 0 AND ppc_ads.paused=0 ';

            if(subPage)
                query += 'AND ppc_ads_subpages.sub_page_id = ? ';

            query += 'ORDER BY ppc_keywords.price DESC';

            var queryParams = ['%' + keyword + '%', '%' + location + '%', '%' + location + '%'];
            
            if(subPage)
                queryParams.push(subPage);

            PaginationHelper.paginate(query, page, null, queryParams).then(
                function(response){
                    resolve(response);
                }, 
                function(error){
                    reject(error);
                }
            );
        });
    },

    saveFlexSearch : function(searchData){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(function(connection){

                if(searchData.length <= 0)
                    return reject(new Error('Cannot save empty search result.'));

                var query = '';

                for (var i = 0; i < searchData.length; i++) {

                    if(typeof searchData[i].keyword_id === 'undefined')
                        searchData[i].keyword_id = null;

                    query += 'INSERT INTO ppc_flex_searches (ppc_flex_id, ppc_flex_keyword_id, ' + 
                    'ppc_flex_subpage_id) ' +
                    'VALUES ('+ searchData[i].flexoffer_link_id +', '+ searchData[i].keyword_id +
                    ', '+ searchData[i].flexoffer_link_subpage_id +');';
                }

                //Run multiple statement query
                connection.query(query, function(err, results, fields){
                    connection.release();

                    if(err)
                        return reject(err);

                    resolve(results);
                });

            },function(error){
                return reject(error);
            });
        });
    },

    saveSponsoredAdSearch : function(searchData){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(function(connection){

                if(searchData.length <= 0)
                    return reject(new Error('Cannot save empty search result.'));

                var query = '';

                for (var i = 0; i < searchData.length; i++) {
                    query += 'INSERT INTO ppc_ad_searches (ad_id, keyword_id, ' + 
                    'keyword_category_id, ad_location_id, ad_subpage_id, price, ' +
                    'url, title, address, lat, lng, phone_no, ad_text, ad_keyword_id) ' +
                    'VALUES ('+ searchData[i].ad_id +', '+ searchData[i].keyword_id +
                    ', '+ searchData[i].keyword_category_id +', '+ 
                    searchData[i].ad_location_id +','+ searchData[i].ad_subpage_id +','+ 
                    searchData[i].price +', \''+ searchData[i].url +'\', \''+ searchData[i].title + 
                    '\',\''+ searchData[i].address +'\', '+ searchData[i].lat +', '+ searchData[i].lng + 
                    ',\''+ searchData[i].phone_no +'\',\''+ searchData[i].ad_text +'\',' + 
                    searchData[i].ad_keyword_id +');';
                }

                //Run multiple statement query
                connection.query(query, function(err, results, fields){
                    connection.release();

                    if(err)
                        return reject(err);

                    resolve(results);
                });

            },function(error){
                return reject(error);
            });
        });
    },


    findDailyDeals : function(keyword, categoryId, page){

        return new Promise(function(resolve, reject) {
            //TODO
            //Check deal availability
            var query = 
            'SELECT ' + 
            'dd.id AS deal_id, ' +
            'm.id AS microsite_id, '+
            'm.company_name, ' +
            'm.what_you_get, '+
            'm.location,' +
            'dd.end_date, ' +
            'dd.start_date, ' +
            'm.discount_daily_description, '+
            'm.discount_percentage, '+
            'dd.discount_type, '+
            'm.name, '+
            'dd.discount_price, ' +
            'm.image, ' +
            'm.image_1, ' +
            'm.image_2, ' +
            'm.code, ' +
            'dd.date_created, ' +
            'dd.download_price, ' +
            'm.discount_description, ' +
            'dd.regular_price, '+
            'dd.discount_rate, '+
            'dd.coupon_name, '+
            'dd.coupon_generated_code, '+
            'dd.is_approved, ' +
            'dd.is_deleted, ' +
            'dd.list_rank, ' +
            'dd.deal_image, ' +
            'dd.paused, ' +
            'm.discount_description, '+
            'm.daily_deal_description, '+
            'dd.approved_category_id '+
            'FROM ppc_daily_deal AS dd LEFT JOIN ppc_deal_microsites ' +
            'AS m ON dd.daily_deal_microsite_id=m.id LEFT JOIN ppc_daily_deal_categories AS cat ON ' +
            'dd.approved_category_id = cat.category_id ' +
            'WHERE dd.is_deleted=0 AND dd.paused=0 AND dd.is_approved=1 AND dd.approved_category_id = ? ';

            var queryParams = [categoryId];

            if(typeof keyword !== "undefined" || keyword != null){
                query += 'AND m.name LIKE ?';
                queryParams.push('%' + keyword + '%');
            }            
            
            PaginationHelper.paginate(query, page, null, queryParams).then(
                function(response){
                    
                    for(var i = 0; i<response.result.length; i++){
                        var redirectUrl = Util.sanitizeUrl(config.get('web_portal_url') + '/' + 
                            'Categories/daily_deals_microsite/' + response.result[i].deal_id);

                        response.result[i].url = config.get('project_url') + 
                        '/api/click/deals/' + response.result[i].deal_id + '/' +
                        redirectUrl
                        ;
                    }
                    
                    resolve(response);
                }, 
                function(error){
                    reject(error);
                }
            );
            
        });
    },

    findFlexOffers : function(subpageId, keyword, page){
        return new Promise(function(resolve, reject) {

            var select = 'iziphub_flexoffer_link.flexoffer_link_id, \
                    iziphub_flexoffer_link.flexoffer_link_content, \
                    iziphub_flexoffer_link.flexoffer_link_subpage_id, \
                    iziphub_flexoffer_link.flexoffer_link_featured, \
                    iziphub_flexoffer_link.flexoffer_link_subpage_id, \
                    iziphub_flexoffer_link.flexoffer_list_order, \
                    iziphub_flexoffer_link.flexoffer_list_order_asc, \
                    iziphub_flexoffer_link.flexoffer_name ';
            var where = '';
            var from = '';
            var queryParams = [];

            if(typeof subpageId !== 'undefined' && subpageId !== null){
                where += 'iziphub_flexoffer_link.flexoffer_link_subpage_id = ? ';
                queryParams.push(subpageId);
            }

            if(typeof keyword !== 'undefined' && keyword !== null){
                select += ', flexoffer_keywords.keyword_id, \
                    flexoffer_keywords.keyword_name, \
                    flexoffer_link_keyword.id AS flexoffer_link_keyword_id ';

                from += 'iziphub_flexoffer_link\
                        JOIN\
                    flexoffer_link_keyword ON iziphub_flexoffer_link.flexoffer_link_id = flexoffer_link_keyword.flexoffer_link_id\
                        JOIN\
                    flexoffer_keywords ON flexoffer_link_keyword.flexoffer_keyword_id = flexoffer_keywords.keyword_id ';
                where += (where === '') ? '':'AND ';
                where += '(flexoffer_keywords.keyword_name LIKE ? OR iziphub_flexoffer_link.flexoffer_name LIKE ?) ';
                queryParams.push('%' + keyword + '%');
                queryParams.push('%' + keyword + '%');

            } else {

                from += 'iziphub_flexoffer_link ';
            }

            if(where === '' || from === '' || queryParams.length === 0)
                return reject(new Error('subpage id or keyword is required.'));

            var query = 'SELECT ' + select + ' FROM ' + from + ' WHERE ' + where;

            PaginationHelper.paginate(query, page, null, queryParams).then(
                function(response){
                    resolve(response);
                }, 
                function(error){
                    reject(error);
                }
            );
        });
    },

    findAllDealCategories : function(){
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function (connection) {

                connection.query('SELECT category_id, category_name FROM ppc_daily_deal_categories',
                    function (err, rows, fields) {
                        connection.release();

                        if(err)
                            reject(err);


                        resolve(rows);
                    });
            },
            function(error){
                reject(error);
            });
        });
    },

    getDealsByCategory : function(categoryId, page){
        
        return new Promise(function(resolve, reject) {

            var query = 
            'SELECT ' + 
            'dd.id AS deal_id, ' +
            'm.id AS microsite_id, '+
            'm.company_name, ' +
            'm.what_you_get, '+
            'm.location,' +
            'dd.end_date, ' +
            'dd.start_date, ' +
            'm.discount_daily_description, '+
            'm.discount_percentage, '+
            'dd.discount_type, '+
            'm.name, '+
            'dd.discount_price, ' +
            'm.image, ' +
            'm.image_1, ' +
            'm.image_2, ' +
            'm.code, ' +
            'dd.date_created, ' +
            'dd.download_price, ' +
            'm.discount_description, ' +
            'dd.regular_price, '+
            'dd.discount_rate, '+
            'dd.coupon_name, '+
            'dd.coupon_generated_code, '+
            'dd.is_approved, ' +
            'dd.is_deleted, ' +
            'dd.list_rank, ' +
            'dd.deal_image, ' +
            'm.discount_description, '+
            'm.daily_deal_description, '+
            'dd.approved_category_id '+
            'FROM ppc_daily_deal AS dd LEFT JOIN ppc_deal_microsites ' +
            'AS m ON dd.daily_deal_microsite_id=m.id ' +
            'WHERE dd.is_deleted=0 AND dd.is_approved=1 AND dd.approved_category_id=' +
            categoryId ;
            PaginationHelper.paginate(query, page).then(
                function(response){
                    resolve(response);
                }, 
                function(error){
                    reject(error);
                }
            );
        });
    },

    getDealsFromEachCategory : function(limit){

        return new Promise(function(resolve, reject) {

            ppcModel.findAllDealCategories().then(function(response){
                if(response.length > 0){
                    //Build Query
                    var query = '';

                    for(var i=0; i<response.length; i++){
                        query += '(' +
                        'SELECT ' + 
                        'dd.id AS deal_id, ' +
                        'm.id AS microsite_id, '+
                        'm.company_name, ' +
                        'm.what_you_get, '+
                        'm.location,' +
                        'dd.end_date, ' +
                        'dd.start_date, ' +
                        'm.discount_daily_description, '+
                        'm.discount_percentage, '+
                        'dd.discount_type, '+
                        'm.name, '+
                        'dd.discount_price, ' +
                        'm.image, ' +
                        'm.image_1, ' +
                        'm.image_2, ' +
                        'm.code, ' +
                        'dd.date_created, ' +
                        'dd.download_price, ' +
                        'm.discount_description, ' +
                        'dd.regular_price, '+
                        'dd.discount_rate, '+
                        'dd.coupon_name, '+
                        'dd.coupon_generated_code, '+
                        'dd.is_approved, ' +
                        'dd.is_deleted, ' +
                        'dd.list_rank, ' +
                        'dd.deal_image, ' +
                        'm.discount_description, '+
                        'm.daily_deal_description, '+
                        'dd.approved_category_id '+
                        'FROM ppc_daily_deal AS dd LEFT JOIN ppc_deal_microsites ' +
                        'AS m ON dd.daily_deal_microsite_id=m.id ' +
                        'WHERE dd.is_deleted=0 AND dd.paused=0 AND dd.is_approved=1 AND dd.approved_category_id=' +
                        response[i].category_id + ' LIMIT ' + limit + ')';

                        if(i < response.length - 1)
                            query += 'UNION ALL';
                    }

                    DbHelper.getConnection().then(
                        function(connection){
                            //Run query
                            connection.query(query,
                                function (err, rows, fields) {
                                    connection.release();

                                    if(err)
                                        return reject(err);

                                    for(var i = 0; i<rows.length; i++){
                                        var redirectUrl = Util.sanitizeUrl(config.get('web_portal_url') + '/' + 
                                            'Categories/daily_deals_microsite/' + rows[i].deal_id);

                                        rows[i].url = config.get('project_url') + 
                                        '/api/click/deals/' + rows[i].deal_id + '/' +
                                        redirectUrl
                                        ;
                                    }

                                    
                                    resolve(rows);
                                }
                            );
                        }, 
                        function(error){
                            reject(error);
                        }
                    );

                    

                } else {
                    reject(new Error('No category found.'));
                }

            }, function(error){
                reject(error);
            })

            
        });
    },

    getAdSearchById : function(searchId){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(function(connection){
                var query = 'SELECT * FROM ppc_ad_searches WHERE id = ? LIMIT 1';
                connection.query(query, [searchId], function(err, results, fields){
                    connection.release();

                    if(err)
                        return reject(err);

                    resolve(results.length > 0 ? results[0] : []);
                });

                
                
            },function(error){
                return reject(error);
            });
        });
    },

    requestMeetsClickPolicy: function(ip, userAgent){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(function(connection){
                var query = 'SELECT COUNT(id) AS count FROM one_hour_analytics ' +
                'WHERE (activity_type_id = ? AND item_type_id = ?) ' +
                ' OR (activity_type_id = ? AND item_type_id = ?) '+
                'AND ip_address =  ? ' +
                'AND user_agent = ? ' +
                'AND device_version = ?';
                connection.query(query, 
                    [
                        ACTIVITY_DOWNLOAD,
                        ITEM_DAILY_DEAL,
                        ACTIVITY_CLICK,
                        ITEM_SPONSORED_AD,
                        ip,
                        userAgent.user_agent,
                        userAgent.device_version

                    ],
                    function(err, results, fields){
                    connection.release();


                    if(err)
                        return reject(err);

                    resolve(results[0].count < 6 ? true : false);
                });

                
                
            },function(error){
                return reject(error);
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
                        return reject(err);

                    resolve(results.insertId);
                });

                
                
            },function(error){
                return reject(error);
            });
        });
    },

    adBudgetLimitCheck: function(searchData){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(function(connection){
                var query = 'SELECT ' + 
                '(ppc_ads.budget_limit - SUM(ppc_ad_searches.price)) AS available_fund, ' +
                'SUM(ppc_ad_searches.price) <= ppc_ads.budget_limit AS has_passed ' +
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
                        return reject(err);

                    if(results.length > 0 && results[0].has_passed !== 0){
                        resolve(true);
                    }

                    resolve(false);
                });

                
                
            },function(error){
                return reject(error);
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
                        return reject(err);

                    resolve(results.affectedRows);
                });

                
                
            },function(error){
                return reject(error);
            });
        });
    }, 

    trackSponsoredAdClick : function(searchData, ip, userAgent, userId){
        return new Promise(function(resolve, reject){
            userModel.getUserGroup(userId).then(
                function(group){

                    //If user has no group then it is a non-member
                    if(group === false){
                        actor_type_id = ACTOR_NON_MEMBER;
                        userId = null;
                    } else {
                        actor_type_id = userModel.getActorType(group);
                    }

                  
                    var query = 'INSERT INTO ppc_analytics SET ?';

                    DbHelper.getConnection().then(function(connection){
                        connection.query(query, 
                            {
                                actor_type_id: actor_type_id,
                                item_type_id: ITEM_SPONSORED_AD,
                                activity_type_id: ACTIVITY_CLICK,
                                item_id: searchData.id,
                                actor_id: userId,
                                ip_address: ip,
                                user_agent: userAgent.user_agent,
                                device_version: userAgent.device_version
                            }, 
                            function(err, results, fields){
                            connection.release();

                            if(err)
                                return reject(err);

                            resolve(results);
                        });
                        
                    },function(error){
                        return reject(error);
                    });

                        
                }, 
                function(error){

                }
            );

        });
    },

    trackSponsoredAdImpression : function(savedSearchIds, ip, userAgent, userId){
        return new Promise(function(resolve, reject){

            userModel.getUserGroup(userId).then(
                function(group){
                    var query = '';
                    var actor_type_id;

                    //If user has no group then it is a non-member
                    if(group === false){
                        actor_type_id = ACTOR_NON_MEMBER;
                        userId = null;
                    } else {
                        actor_type_id = userModel.getActorType(group);
                    }

                    var query = '';
                    if(savedSearchIds instanceof Array){
                        for(var i = 0; i<savedSearchIds.length; i++){
                            query += 'INSERT INTO ppc_analytics (item_type_id, activity_type_id, ' + 
                        'actor_type_id, item_id, actor_id, ip_address, user_agent, device_version) ' +
                        'VALUES ('+ ITEM_SPONSORED_AD +', '+ ACTIVITY_IMPRESSION +
                        ', '+ actor_type_id +', '+ savedSearchIds[i].insertId +
                        ', '+ userId +',\''+ ip +'\',\''+ userAgent.user_agent +'\',\''+ 
                        userAgent.device_version +'\');';
                        }
                    } else {
                        query += 'INSERT INTO ppc_analytics (item_type_id, activity_type_id, ' + 
                        'actor_type_id, item_id, actor_id, ip_address, user_agent, device_version) ' +
                        'VALUES ('+ ITEM_SPONSORED_AD +', '+ ACTIVITY_IMPRESSION +
                        ', '+ actor_type_id +', '+ savedSearchIds.insertId +
                        ', '+ userId +',\''+ ip +'\',\''+ userAgent.user_agent +'\',\''+ 
                        userAgent.device_version +'\');';
                    }

                    DbHelper.getConnection().then(function(connection){
                        connection.query(query, function(err, results, fields){
                            connection.release();

                            if(err)
                                reject(err);

                            resolve(results);
                        });
                        
                    },function(error){
                        return reject(error);
                    });

                
                }, 
                function(error){
                    reject(error);
                }
            );                
               
        });
    },

    trackDailyDealImpression : function(deals, ip, userAgent, userId){
        return new Promise(function(resolve, reject){
            userModel.getUserGroup(userId).then(
                function(group){
                    var query = '';
                    var actor_type_id;

                    //If user has no group then it is a non-member
                    if(group === false){
                        actor_type_id = ACTOR_NON_MEMBER;
                        userId = null;
                    } else {
                        actor_type_id = userModel.getActorType(group);
                    }

                    for(var i = 0; i<deals.length; i++){
                        
                        query += 'INSERT INTO ppc_analytics (item_type_id, activity_type_id, ' + 
                        'actor_type_id, item_id, actor_id, ip_address, user_agent, device_version) ' +
                        'VALUES ('+ ITEM_DAILY_DEAL +', '+ ACTIVITY_IMPRESSION +
                        ', '+ actor_type_id +', '+ deals[i].deal_id +
                        ', '+ userId +',\''+ ip +'\',\''+ userAgent.user_agent +'\',\''+ 
                        userAgent.device_version +'\');';
                    }


                    DbHelper.getConnection().then(function(connection){
                        connection.query(query, function(err, results, fields){
                            connection.release();

                            if(err)
                                return reject(err);

                            resolve(results);
                        });
                        
                    },function(error){
                        reject(error);
                    });

                
                }, 
                function(error){
                    reject(error);
                }
            );

        });
    },

    trackDealClick : function(deal, ip, userAgent, userId){

        return new Promise(function(resolve, reject){

            userModel.getUserGroup(userId).then(
                function(group){

                    //If user has no group then it is a non-member
                    if(group === false){
                        actor_type_id = ACTOR_NON_MEMBER;
                        userId = null;
                    } else {
                        actor_type_id = userModel.getActorType(group);
                    }

                    var query = 'INSERT INTO ppc_analytics SET ?';
                    DbHelper.getConnection().then(function(connection){
                        connection.query(query, 
                            {
                                actor_type_id: actor_type_id,
                                item_id: deal.deal_id,
                                actor_id: userId,
                                ip_address: ip,
                                user_agent: userAgent.user_agent,
                                device_version: userAgent.device_version,
                                activity_type_id: ACTIVITY_CLICK,
                                item_type_id: ITEM_DAILY_DEAL
                            }, 
                            function(err, results, fields){
                                connection.release();

                                if(err)
                                    return reject(err);

                                resolve(results.insertId);
                            }
                        );
                        
                    },function(error){
                        reject(error);
                    });

                    
                }, 
                function(error){
                    reject(error);
                }
            );

        });
    },

    trackDealDownload : function(deal, ip, userAgent, userId){
        return new Promise(function(resolve, reject){

            userModel.getUserGroup(userId).then(
                function(group){

                    //If user has no group then it is a non-member
                    if(group === false){
                        actor_type_id = ACTOR_NON_MEMBER;
                        userId = null;
                    } else {
                        actor_type_id = userModel.getActorType(group);
                    }

                    var query = 'INSERT INTO ppc_analytics SET ?';
                    DbHelper.getConnection().then(function(connection){
                        connection.query(query, 
                            {
                                actor_type_id: actor_type_id,
                                item_id: deal.deal_id,
                                actor_id: userId,
                                ip_address: ip,
                                user_agent: userAgent.user_agent,
                                device_version: userAgent.device_version,
                                activity_type_id: ACTIVITY_DOWNLOAD,
                                item_type_id: ITEM_DAILY_DEAL
                            }, 
                            function(err, results, fields){
                                connection.release();

                                if(err)
                                    return reject(err);

                                resolve(results.insertId);
                            }
                        );
                        
                    },function(error){
                        reject(error);
                    });

                    
                }, 
                function(error){
                    reject(error);
                }
            );

        });
    },

    trackFlexClick : function(searchData, ip, userAgent, userId){

        return new Promise(function(resolve, reject){

            userModel.getUserGroup(userId).then(
                function(group){

                    //If user has no group then it is a non-member
                    if(group === false){
                        actor_type_id = ACTOR_NON_MEMBER;
                        userId = null;
                    } else {
                        actor_type_id = userModel.getActorType(group);
                    }

                    var query = 'INSERT INTO ppc_analytics SET ?';
                    DbHelper.getConnection().then(function(connection){
                        connection.query(query, 
                            {
                                actor_type_id: actor_type_id,
                                item_id: searchData.id,
                                actor_id: userId,
                                ip_address: ip,
                                user_agent: userAgent.user_agent,
                                device_version: userAgent.device_version,
                                activity_type_id: ACTIVITY_CLICK,
                                item_type_id: ITEM_FLEX_OFFER
                            }, 
                            function(err, results, fields){
                                connection.release();

                                if(err)
                                    return reject(err);

                                resolve(results.insertId);
                            }
                        );
                        
                    },function(error){
                        reject(error);
                    });

                    
                }, 
                function(error){
                    reject(error);
                }
            );

        });
    },

    getDealById : function(dealId){

        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){

                //TODO
                //Check deal availability
                var query = 
                'SELECT ' + 
                'dd.id AS deal_id, ' +
                'm.id AS microsite_id, '+
                'm.company_name, ' +
                'm.what_you_get, '+
                'm.location,' +
                'dd.end_date, ' +
                'dd.start_date, ' +
                'm.discount_daily_description, '+
                'm.discount_percentage, '+
                'dd.discount_type, '+
                'm.name, '+
                'dd.discount_price, ' +
                'm.image, ' +
                'm.image_1, ' +
                'm.image_2, ' +
                'm.code, ' +
                'dd.date_created, ' +
                'dd.download_price, ' +
                'm.discount_description, ' +
                'dd.regular_price, '+
                'dd.discount_rate, '+
                'dd.coupon_name, '+
                'dd.coupon_generated_code, '+
                'dd.is_approved, ' +
                'dd.is_deleted, ' +
                'dd.list_rank, ' +
                'dd.deal_image, ' +
                'm.discount_description, '+
                'm.daily_deal_description, '+
                'dd.approved_category_id '+
                'FROM ppc_daily_deal AS dd LEFT JOIN ppc_deal_microsites ' +
                'AS m ON dd.daily_deal_microsite_id=m.id ' +
                'WHERE dd.is_deleted=0 AND dd.is_approved=1 AND dd.id=?';

                connection.query(
                    query, 
                    [dealId],
                    function (err, rows, fields) {

                        //release connection
                        connection.release();

                        if(err){
                            return reject(err);
                        }

                        if(rows.length <= 0)
                            return reject(new Error('No deal found.'));

                        resolve(rows[0]);
                    }
                );
            }, function(error){
                reject(error);
            });

            
        });
    },

    getFlexSearchById : function(flexSearchId){

        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){

                connection.query(
                    "SELECT * FROM ppc_flex_searches WHERE id = ?", 
                    [flexSearchId],
                    function (err, rows, fields) {

                        //release connection
                        connection.release();

                        if(err){
                            return reject(err);
                        }

                        if(rows.length <= 0)
                            return reject(new Error('No flex offer search found with this id.'));

                        resolve(rows[0]);
                    }
                );
            }, function(error){
                reject(error);
            });

            
        });
    },

    getNumDealDownloads: function(dealId){
        return new Promise(function(resolve, reject) {
                DbHelper.getConnection().then(function(connection){
                    connection.query(
                        "SELECT count(ppc_analytics.id) AS downloads \
                        FROM ppc_analytics WHERE item_id = ? \
                        AND item_type_id=? AND activity_type_id=? AND disapproved=0", 
                        [dealId, ITEM_DAILY_DEAL, ACTIVITY_DOWNLOAD],
                        function (err, rows, fields) {

                            //release connection
                            connection.release();

                            if(err){
                                return reject(err);
                            }
                            resolve(rows[0]);
                        }
                    );
                }, function(error){
                    reject(error);
                });

                
            });
    },

    getAllAdAnalytics: function(adId){
        return new Promise(function(resolve, reject) {
                DbHelper.getConnection().then(function(connection){
                    var query = "SELECT a.item_type_id, k.keyword, a.activity_type_id,\
                     a.actor_type_id, a.item_id, a.actor_id, a.activity_time, \
                     a.ip_address, a.user_agent, a.device_version, s.ad_id, \
                     s.keyword_id, s.keyword_category_id, s.ad_location_id, \
                     s.ad_subpage_id, s.price, s.url, s.title, s.address, \
                     s.lat, s.lng, s.phone_no, s.ad_text, s.ad_keyword_id \
                        FROM ppc_analytics AS a JOIN ppc_ad_searches AS s \
                        ON a.item_id = s.id \
                        JOIN ppc_keywords AS k ON k.id = s.keyword_id \
                        WHERE s.ad_id = " + adId +
                        " AND a.item_type_id= " + ITEM_SPONSORED_AD + 
                        " AND (a.activity_type_id=" + ACTIVITY_CLICK + 
                        " OR a.activity_type_id="+ ACTIVITY_IMPRESSION + 
                        ") AND a.disapproved=0";
                    connection.query(
                        query, 
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

module.exports = ppcModel;