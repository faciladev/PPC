var Promise = require('bluebird');
var config = require('config');

var DbHelper = require('../lib/DbHelper');
var PaginationHelper = require('../lib/PaginationHelper');
var Util = require('../lib/util');
var userModel = require('./userModel');
var appError = require('../app_error');

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

const FRAUDULENT_ANALYTICS_STATUS = 'FRAUDULENT';
const APPROVED_ANALYTICS_STATUS = 'APPROVED';



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
    FRAUDULENT_ANALYTICS_STATUS: FRAUDULENT_ANALYTICS_STATUS,
    APPROVED_ANALYTICS_STATUS: APPROVED_ANALYTICS_STATUS,

    findSponsoredAds : function(keyword, location, subPage, page, filter){
        return new Promise(function(resolve, reject) {
            
            subPage = parseInt(subPage);
            if(isNaN(subPage) || subPage === 0)
                subPage = false;
            
            var query = 
            'SELECT ' +
            'available_ad_keywords.ad_keyword_id, '+ 
            'usa_states.usa_state_code, ' +
            'usa_states.usa_state_name, ' +
            'ppc_ad_microsites.city, ' +
            'ppc_ad_microsites.zipcode, ' +
            'ppc_ads.id AS ad_id, ' +
            'ppc_ads.url, ' +
            'ppc_ads.title, ' +
            'ppc_ads.address, ' +
            'ppc_ads.advertiser_id, ' +
            'ppc_ads.lat, ' +
            'ppc_ads.lng, ' +
            'ppc_ads.phone_no, ' +
            'ppc_ads.ad_text, ' +
            'ppc_keywords.price, ' +
            'available_ad_keywords.keyword_category_id,' +
            'ppc_ad_locations.id AS ad_location_id, ' +

            'ppc_ads_subpages.sub_page_id AS ad_subpage_id, ' +

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

            'JOIN ppc_ads_subpages ON ppc_ads.id = ppc_ads_subpages.ad_id ' +
            'JOIN advertisers ON advertisers.advertizer_id = ppc_ads.advertiser_id ' +
            'AND advertisers.advertizer_deleted = 0 AND advertizer_status = 4 ' +

            'WHERE ' +
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

    saveConsumerAdOffer: function(consumerId, offerId){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(
                function(connection){
                    consumerId = parseInt(consumerId);
                    offerId = parseInt(offerId);
                    if(isNaN(consumerId) || isNaN(offerId))
                        return reject(new appError('Invalid consumer id or offer id.'));

                    const query = "INSERT INTO saved_offers (consumer_user_id, offer_id, item_type_id) VALUES (?,?,?)";
                    connection.query(query, [consumerId, offerId, ITEM_SPONSORED_AD], function(err, results, fields){
                        if(err)
                            return reject(err);

                        return resolve(results);
                    })
                }, 
                function(error){
                    return reject(error);
                }
            );
        });
    },

    deleteConsumerAdOffer: (userId, consumerOfferId) => {
        return new Promise((resolve, reject) => {
            let query = "DELETE FROM saved_offers WHERE consumer_user_id = ? AND offer_id = ? AND item_type_id = ?";
            let queryParams = [userId, consumerOfferId, ITEM_SPONSORED_AD];

            DbHelper.getConnection().then(
                connection => {
                    connection.query(query, queryParams, (err, rows, fields) => {
                        if(err) return reject(err);

                        return resolve(rows);
                    });
                },
                error => {
                    reject(error);
                }
            );
        });
    },

    findConsumerAdOffer: function(consumerId, page){
        return new Promise(function(resolve, reject){

            let query = "SELECT " +
                "saved_offers.id AS offer_consumer_id," +
                "saved_offers.saved_date," +
                "ppc_offers.*," +
                "ppc_ads.id AS ad_id," +
                "ppc_ad_microsites.id AS microsite_id " +
            "FROM " +
                "saved_offers " +
                    "JOIN " +
                "ppc_offers ON ppc_offers.id = saved_offers.offer_id " +
                    "JOIN " +
                "ppc_ad_offers ON ppc_offers.id = ppc_ad_offers.offer_id " +
                    "JOIN " +
                "ppc_ads ON ppc_ad_offers.ad_id = ppc_ads.id " +
                    "JOIN " +
                "ppc_ad_microsites ON ppc_ads.id = ppc_ad_microsites.ad_id " +
            "WHERE " +
                "saved_offers.consumer_user_id = ? " +
                    "AND saved_offers.item_type_id = ? " +
                    "AND ppc_ads.is_deleted = 0";

            PaginationHelper.paginate(query, page, null, [consumerId, ITEM_SPONSORED_AD]).then(
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
                    return reject(new appError('Cannot save empty search result.'));

                var query = '';

                for (var i = 0; i < searchData.length; i++) {

                    if(typeof searchData[i].keyword_id === 'undefined')
                        searchData[i].keyword_id = null;

                    let hrefStartIdx = searchData[i].flexoffer_link_content.indexOf("href=");
                    let hrefEndIdx = searchData[i].flexoffer_link_content.indexOf(" ", hrefStartIdx);
                    searchData[i]['url'] = searchData[i].flexoffer_link_content.substring(hrefStartIdx + 6, hrefEndIdx - 1);
                    
                   
                    
                    query += DbHelper.prepare('INSERT INTO ppc_flex_searches (ppc_flex_id, ppc_flex_keyword_id, ' + 
                    'ppc_flex_subpage_id, url) ' +
                    'VALUES (?,?,?,?);', [
                        searchData[i].flexoffer_link_id,
                        searchData[i].keyword_id,
                        searchData[i].flexoffer_link_subpage_id,
                        searchData[i].url
                    ]);
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
                    return reject(new appError('Cannot save empty search result.'));

                var query = '';
                let advertiser_ids = [];

                for (var i = 0; i < searchData.length; i++) {
                    //save advertiser id of each ad
                    advertiser_ids.push(searchData[i].advertiser_id);

                    query += 'INSERT INTO ppc_ad_searches (ad_id, keyword_id, ' + 
                    'keyword_category_id, ad_location_id, ad_subpage_id, price, ' +
                    'url, title, address, lat, lng, phone_no, ad_text, ad_keyword_id, advertiser_id) ' +
                    'VALUES ('+ connection.escape(searchData[i].ad_id) +', '+ connection.escape(searchData[i].keyword_id) +
                    ', '+ connection.escape(searchData[i].keyword_category_id) +', '+ 
                    connection.escape(searchData[i].ad_location_id) +','+ connection.escape(searchData[i].ad_subpage_id) +','+ 
                    connection.escape(searchData[i].price) +', '+ connection.escape(searchData[i].url) +','+ connection.escape(searchData[i].title) + 
                    ','+ connection.escape(searchData[i].address) +', '+ connection.escape(searchData[i].lat) +', '+ connection.escape(searchData[i].lng) + 
                    ','+ connection.escape(searchData[i].phone_no) +','+ connection.escape(searchData[i].ad_text) +',' + 
                    connection.escape(searchData[i].ad_keyword_id) + ',' + connection.escape(searchData[i].advertiser_id) +');';
                }


                //Run multiple statement query
                connection.query(query, function(err, results, fields){
                    connection.release();

                    if(err)
                        return reject(err);

                    resolve({results, advertiser_ids});
                });

            },function(error){
                return reject(error);
            });
        });
    },

    getNearestDeals: (lat, lng, radius, limit) => {
        return new Promise((resolve, reject) => {
            lat = Number(lat);
            lng = Number(lng);
            radius = parseInt(radius);//In miles
            limit = parseInt(limit);

            if(isNaN(lat) || isNaN(lng) || isNaN(radius)) 
                return reject(new appError('Invalid input'));

            let squareBoundary = Util.getNearestSquareBoundary(lat, lng, radius);
            if(!squareBoundary) return reject(new appError('Cannot resolve square boundary.'));

            let query = 
            'SELECT ' + 
            'dd.id AS deal_id, ' +
            'm.id AS microsite_id, '+
            'm.company_name, ' +
            'm.what_you_get, '+
            'm.location,' +
            'm.city,' +
            'm.zip_code,' +
            'm.lat, m.lng,' +
            'usa_states.usa_state_code,' +
            'usa_states.usa_state_name,' +
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
            'JOIN usa_states ON usa_states.usa_state_id = m.state_id ' +
            'WHERE dd.is_deleted=0 AND dd.paused=0 AND dd.is_approved=1 ' +
            'AND lat BETWEEN ? AND ? AND lng BETWEEN ? AND ? ';

            let queryParams = [
            squareBoundary.minLat,
            squareBoundary.maxLat,
            squareBoundary.minLng,
            squareBoundary.maxLng
            ];

            if(! isNaN(limit)){
                query += "LIMIT ? ";
                queryParams.push(limit);
            }

            DbHelper.getConnection().then(function(connection){

                connection.query(query, queryParams, function(err, results, fields){
                    connection.release();

                    if(err)
                        return reject(err);
                    
                    let finalResult = [];

                    if(results.length === 0)
                        return resolve(results);

                    for(var i = 0; i<results.length; i++){
                        var redirectUrl = Util.sanitizeUrl(config.get('web_portal_url') + '/' + 
                            'Categories/daily_deals_microsite/' + results[i].deal_id);

                        results[i].url = config.get('project_url') + 
                        '/api/click/deals/' + results[i].deal_id + '/' +
                        redirectUrl
                        ;

                        let distance = Util.getDistanceBtnPoints(
                            Number(results[i].lat),
                            Number(results[i].lng),
                            Number(lat),
                            Number(lng)
                        );

                        if(!isNaN(distance)) {
                            //Remove items outside circle
                            if(distance <= radius){
                                results[i].distance = distance.toFixed(1);
                                finalResult.push(results[i]);
                            }

                        }

                        if(i === results.length - 1){
                            //Sort in ascending order
                            finalResult.sort(function(a, b){
                                return parseFloat(a.distance) - parseFloat(b.distance);
                            });

                            return resolve(finalResult);
                        }
                    }

                    
                });

            },function(error){
                return reject(error);
            });
            
        });
    },


    findDailyDeals : function(keyword, categoryId, page, location){

        return new Promise(function(resolve, reject) {
            const NUM_ROWS_PER_PAGE = 32;
            //TODO
            //Check deal availability
            var query = 
            'SELECT ' + 
            'dd.id AS deal_id, ' +
            'dd.advertiser_id, ' +
            'm.id AS microsite_id, '+
            'm.company_name, ' +
            'm.what_you_get, '+
            'm.location,' +
            'm.city,' +
            'm.zip_code,' +
            'usa_states.usa_state_code,' +
            'usa_states.usa_state_name,' +
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
            'dd.keywords, ' +
            'dd.deal_image, ' +
            'dd.paused, ' +
            'm.discount_description, '+
            'm.daily_deal_description, '+
            'dd.approved_category_id '+
            'FROM ppc_daily_deal AS dd LEFT JOIN ppc_deal_microsites ' +
            'AS m ON dd.daily_deal_microsite_id=m.id LEFT JOIN ppc_daily_deal_categories AS cat ON ' +
            'dd.approved_category_id = cat.category_id ' +
            'JOIN usa_states ON usa_states.usa_state_id = m.state_id ' +
            'WHERE dd.is_deleted=0 AND dd.paused=0 AND dd.is_approved=1 ';

            

            var queryParams = []; 
            if(! isNaN(parseInt(categoryId))){
                query += 'AND dd.approved_category_id = ? ';
                queryParams.push(categoryId);
            }
            
            if(typeof keyword !== "undefined" || keyword != null){
                query += 'AND (m.name LIKE ? OR dd.keywords LIKE ? )';
                queryParams.push('%' + keyword + '%', '%' + keyword + '%');
            }            
            
            // if(location){
            //     query += ' AND m.zip_code LIKE ? OR m.city LIKE ? ';
            //     queryParams.push('%' + location + '%', '%' + location + '%');
            // }

            if(location){
                query += ' AND (m.city LIKE ' + DbHelper.escape('%' + location + '%') + ' OR ';
                query += ' m.zip_code LIKE ' + DbHelper.escape('%' + location + '%') + ')';
            }

            PaginationHelper.paginate(query, page, NUM_ROWS_PER_PAGE, queryParams).then(
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

    findFlexOffers : function(subpageId, keyword, page, filter, letter){
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
            var order = '';
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

            if(filter === "featured"){
                where += (where === '') ? '':' AND iziphub_flexoffer_link.flexoffer_link_featured = 1 ';
                order += ' ORDER BY iziphub_flexoffer_link.flexoffer_list_order_asc ASC, ' +
                    '(iziphub_flexoffer_link.flexoffer_name = "" || iziphub_flexoffer_link.flexoffer_name IS NULL),' +
                    'iziphub_flexoffer_link.flexoffer_name ASC';
            } else if(filter === "all") {
                where += (where === '') ? '':' AND iziphub_flexoffer_link.flexoffer_link_featured = 0 ';
                order += ' ORDER BY iziphub_flexoffer_link.flexoffer_list_order_asc ASC, ' +
                    '(iziphub_flexoffer_link.flexoffer_name = "" || iziphub_flexoffer_link.flexoffer_name IS NULL),' +
                    'iziphub_flexoffer_link.flexoffer_name ASC';
            } else {
                order += ' ORDER BY iziphub_flexoffer_link.flexoffer_list_order_asc ASC, ' +
                    '(iziphub_flexoffer_link.flexoffer_name = "" || iziphub_flexoffer_link.flexoffer_name IS NULL),' +
                    'iziphub_flexoffer_link.flexoffer_name ASC';
            }

            if(typeof letter === "string" && letter.length === 1){
                where += " AND iziphub_flexoffer_link.flexoffer_name LIKE ? ";
                order = (order.length > 0)? order : 
                ' ORDER BY iziphub_flexoffer_link.flexoffer_list_order_asc ASC, ' +
                '(iziphub_flexoffer_link.flexoffer_name = "" || iziphub_flexoffer_link.flexoffer_name IS NULL),' +
                'iziphub_flexoffer_link.flexoffer_name ASC';
                queryParams.push(letter + '%');
            }
            
            where = (where === '')? '' : ' WHERE ' + where;

            var query = 'SELECT ' + select + ' FROM ' + from + where + order;

            DbHelper.getConnection().then(
                function(connection){

                    connection.query(query, queryParams, function(err, rows, fields){
                        connection.release()

                        if(err)
                            return reject(err);

                        return resolve(rows);
                    });
                }, 
                function(error){
                    return reject(error);
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

    getDealsFromEachCategory : function(limit, location){

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
                        response[i].category_id;

                        if(location){
                            query += ' AND (m.city LIKE ' + DbHelper.escape('%' + location + '%') + ' OR ';
                            query += ' m.zip_code LIKE ' + DbHelper.escape('%' + location + '%') + ')';
                        }

                        query += ' LIMIT ' + limit + ')';

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
                    reject(new appError('No category found.'));
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

    requestMeetsClickPolicy: function(ip, userAgent, data, userId){
        return new Promise(function(resolve, reject){

            DbHelper.getConnection().then(function(connection){

                var MAX_COUNT = 1;
                var TWENTY_FOUR_HOUR_POLICY = 'twenty_four_hour_analytics';
                var ONE_HOUR_POLICY = 'one_hour_analytics';

                var query = 'SELECT COUNT(id) AS count FROM ' + 
                TWENTY_FOUR_HOUR_POLICY + ' ' +
                'WHERE activity_type_id = ? AND item_type_id = ? ' +
                'AND item_id = ? ' +
                'AND ip_address =  ? ' +
                'AND user_agent = ? ' +
                'AND device_version = ? ';

                var queryParams = [
                    data.activity_type_id,
                    data.item_type_id,
                    data.item_id,
                    ip,
                    userAgent.user_agent,
                    userAgent.device_version
                ];

                if(typeof data.actor_id !== "undefined"){
                    queryParams.push(data.actor_id);
                    query += ' AND actor_id = ? ';
                }
               
                connection.query(query, 
                    queryParams,
                    function(err, results, fields){
                    connection.release();


                    if(err)
                        return reject(err);
                    
                    resolve(results[0].count < MAX_COUNT ? true : false);
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
                '((ppc_ads.budget_limit - SUM(ppc_ad_searches.price)) < (ppc_ads.budget_limit * 0.1)) AS low_budget, ' +
                'SUM(ppc_ad_searches.price) < ppc_ads.budget_limit AS has_passed ' +
                'FROM ppc_ad_searches ' + 
                
                'JOIN ppc_analytics ON ' +
                'ppc_ad_searches.id = ppc_analytics.item_id '+
                'JOIN ppc_ads ON ppc_ad_searches.ad_id = ppc_ads.id ' +
                ' WHERE ' +
                'ppc_analytics.item_type_id = ' + ITEM_SPONSORED_AD + 
                ' AND ppc_analytics.activity_type_id = ' + ACTIVITY_CLICK +
                ' AND ppc_ad_searches.clicked = 1 ' +
                ' AND ppc_ads.budget_limit >= 1 AND ' +
                'IF(ppc_ads.budget_period = \'daily\', ppc_analytics.activity_time BETWEEN ' +
                'CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 1 DAY), ' +
                'ppc_analytics.activity_time BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY))' +
                ' GROUP BY ppc_ads.id';
                var x = DbHelper.prepare(query, [
                        searchData.ad_id, 
                        Util.firstDay(), 
                        Util.lastDay()
                    ]);

                connection.query(query, 
                    [
                        Util.firstDay(), 
                        Util.lastDay()
                    ], 
                    function(err, results, fields){
                    connection.release();

                    if(err)
                        return reject(err);

                    //Query result returned and result is set
                    if(results.length > 0)
                        return resolve(results[0]);

                    //No click data found for this available ad
                    if(results.length === 0)
                        return resolve({has_passed: 1, low_budget: 0});

                    reject(new appError('Failed to check budget for sponsor ad.'));
                });

                
                
            },function(error){
                reject(error);
            });
        });
    },

    dealBudgetLimitCheck: function(deal){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(function(connection){
                var query = 'SELECT ' + 
                'COUNT(ppc_analytics.id) AS downloads,' +
                'dd.budget_limit - (COUNT(ppc_analytics.id) * dd.download_price) AS available_fund, ' +
                '((dd.budget_limit - (COUNT(ppc_analytics.id) * dd.download_price)) < (dd.budget_limit * 0.1)) AS low_budget, ' +
                '(COUNT(ppc_analytics.id) * dd.download_price) < dd.budget_limit AS has_passed ' +
                'FROM ppc_daily_deal AS dd ' + 
                
                'JOIN ppc_analytics ON ' +
                'dd.id = ppc_analytics.item_id '+
                ' WHERE ' +
                'ppc_analytics.item_type_id = ' + ITEM_DAILY_DEAL + 
                ' AND ppc_analytics.activity_type_id = ' + ACTIVITY_DOWNLOAD +
                ' AND dd.budget_limit >= 1 AND ' +
                'IF(dd.budget_period = \'daily\', ppc_analytics.activity_time BETWEEN ' +
                'CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 1 DAY), ' +
                'ppc_analytics.activity_time BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY))' +
                ' GROUP BY dd.id';


                connection.query(query, 
                    [
                        Util.firstDay(), 
                        Util.lastDay()
                    ], 
                    function(err, results, fields){
                    connection.release();

                    if(err)
                        return reject(err);

                    //Query result returned and result is set
                    if(results.length > 0)
                        return resolve(results[0]);

                    //No click data found for this available ad
                    if(results.length === 0)
                        return resolve({has_passed: 1, low_budget: 0});

                    reject(new appError('Failed to check budget for daily deal.'));
                });

                
                
            },function(error){
                reject(error);
            });
        });
    },

    postponeAdAvailability: function(adId){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(function(connection){
                connection.query("SELECT budget_period FROM ppc_ads WHERE ppc_ads.id = ?", 
                    [adId], 
                    function(err, rows, fields){
                        if(err){
                            connection.release();
                            return reject(err);
                        }

                        if(rows.length <= 0)
                            return reject(new appError('No sponsor ad found to update budget_period'));

                        var budget_period = rows[0].budget_period;

                        var query = '';
                        var queryParams = [];

                        switch(budget_period){
                            case DAILY_BUDGET_PERIOD:
                                query += 'UPDATE ppc_ads SET available_since = (DATE_ADD(NOW(), INTERVAL 1 DAY)) WHERE ppc_ads.id = ?';
                                break;
                            case WEEKLY_BUDGET_PERIOD:
                                query += 'UPDATE ppc_ads SET available_since = (DATE_ADD(?, INTERVAL 1 DAY)) WHERE ppc_ads.id = ?';
                                queryParams.push(Util.lastDay());
                                break;
                            default:
                                break;
                        }

                        if(query === '')
                            return reject(new appError('Sponsored ad must have a valid budget period.'));

                        queryParams.push(adId);

                        connection.query(query, 
                            queryParams, 
                            function(err, results, fields){
                            connection.release();

                            if(err)
                                return reject(err);

                            resolve(results);
                        });
                    }
                );
                        

                
                
            },function(error){
                reject(error);
            });
        });
    }, 

    postponeDealAvailability: function(dealId){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(function(connection){
                connection.query("SELECT budget_period FROM ppc_daily_deal WHERE ppc_daily_deal.id = ?", 
                    [dealId], 
                    function(err, rows, fields){
                        if(err){
                            connection.release();
                            return reject(err);
                        }

                        if(rows.length <= 0)
                            return reject(new appError('No daily deal found to update budget_period'));

                        var budget_period = rows[0].budget_period;

                        var query = '';
                        var queryParams = [];

                        switch(budget_period){
                            case DAILY_BUDGET_PERIOD:
                                query += 'UPDATE ppc_daily_deal SET available_since = (DATE_ADD(NOW(), INTERVAL 1 DAY)) WHERE ppc_daily_deal.id = ?';
                                break;
                            case WEEKLY_BUDGET_PERIOD:
                                query += 'UPDATE ppc_daily_deal SET available_since = (DATE_ADD(?, INTERVAL 1 DAY)) WHERE ppc_daily_deal.id = ?';
                                queryParams.push(Util.lastDay());
                                break;
                            default:
                                break;
                        }

                        if(query === '')
                            return reject(new appError('Daily deal must have a valid budget period.'));

                        queryParams.push(dealId);

                        connection.query(query, 
                            queryParams, 
                            function(err, results, fields){
                            connection.release();

                            if(err)
                                return reject(err);

                            resolve(results);
                        });
                    }
                );
                        

                
                
            },function(error){
                reject(error);
            });
        });
    }, 

    sendLowBudgetNotification: function(adId){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(
                function(connection){
                    connection.query(
                        'SELECT advertiser_id FROM ppc_ads WHERE id = ?',
                        [adId],
                        function(err, rows, fields){
                            if(err){
                                connection.release();
                                return reject(err);
                            }

                            if(rows.length <= 0)
                                return reject(new appError('No advertiser found for this sponsor ad.'));

                            var userId = rows[0].advertiser_id;
                            connection.beginTransaction(
                                function(err) {
                                    if(err){
                                        connection.release();
                                        reject(err);
                                    }
                                    var query1 = "INSERT INTO admin_notifications SET ?";
                                    var query2 = "INSERT INTO admin_notifications_user SET ?";
                                    connection.query(query1,
                                        {
                                            notification_subject: "Available Funds Low",
                                            notification_text: "Your available funds are low. If it is not refilled your sponsored ad will not be displayed on the ziphub portal",
                                            for_user_group: "Advertizer"
                                        }, 
                                        function(err, rows, fields){
                                            if(err){
                                                return connection.rollback(function(){
                                                    connection.release();
                                                    reject(err);
                                                });
                                            }

                                            var notificationId = rows.insertId;

                                            connection.query(query2, 
                                                {user_id: userId, notification_id: notificationId}, 
                                                function(err, rows, fields){
                                                    if(err){
                                                        return connection.rollback(function(){
                                                            connection.release();
                                                            reject(err);
                                                        });
                                                    }

                                                    connection.commit(function(err){
                                                        if(err){
                                                            return connection.rollback(function(){
                                                                connection.release();
                                                                reject(err);
                                                            });
                                                        }

                                                        connection.release();
                                                        resolve(rows);
                                                    });
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                            
                },
                function(error){
                    reject(error);
                }
            );
        });
    },

    trackSponsoredAdClick : function(searchData, ip, userAgent, userId, isFeatured){
        return new Promise(function(resolve, reject){
            isFeatured = isFeatured || false;
            userModel.getUserGroup(userId).then(
                function(group){

                    //If user has no group then it is a non-member
                    if(group === false){
                        actor_type_id = ACTOR_NON_MEMBER;
                        userId = null;
                    } else {
                        actor_type_id = userModel.getActorType(group);
                    }

                  
                    var query1 = (! isFeatured) ? 
                        'INSERT INTO ppc_analytics SET ?' :
                        'INSERT INTO ppc_ad_searches SET ?';

                    var query2 = (! isFeatured) ? 
                    "UPDATE ppc_ad_searches SET ? WHERE id = ?" :
                    "INSERT INTO ppc_analytics SET ?";

                    var query1Params = (! isFeatured) ? {
                                        actor_type_id: actor_type_id,
                                        item_type_id: ITEM_SPONSORED_AD,
                                        activity_type_id: ACTIVITY_CLICK,
                                        item_id: searchData.id,
                                        actor_id: userId,
                                        ip_address: ip,
                                        user_agent: userAgent.user_agent,
                                        device_version: userAgent.device_version,
                                        fraudulent: searchData.fraudulent,
                                        advertiser_id: searchData.advertiser_id,
                                        ppc_analytics_status: searchData.ppc_analytics_status
                                    } : 
                                    {
                                        ad_id: searchData.ad_id,
                                        keyword_id: searchData.keyword_id,
                                        keyword_category_id: searchData.keyword_category_id,
                                        price: searchData.price,
                                        ad_subpage_id: searchData.ad_subpage_id,
                                        clicked: 1,
                                        advertiser_id: searchData.advertiser_id
                                    };



                    var query2Params = (! isFeatured) ?  [
                                            {
                                                clicked: 1
                                            },
                                            searchData.id
                                        ] :
                                        {
                                            actor_type_id: actor_type_id,
                                            item_type_id: ITEM_SPONSORED_AD,
                                            activity_type_id: ACTIVITY_CLICK,
                                            //item_id: assigned from analytics table transaction return
                                            actor_id: userId,
                                            ip_address: ip,
                                            user_agent: userAgent.user_agent,
                                            device_version: userAgent.device_version,
                                            fraudulent: searchData.fraudulent,
                                            advertiser_id: searchData.advertiser_id,
                                            ppc_analytics_status: searchData.ppc_analytics_status
                                        };

                    DbHelper.getConnection().then(function(connection){

                        connection.beginTransaction(function(err) {
                            if(err){
                                connection.release();
                                reject(err);
                            }

                            connection.query(query1, query1Params,
                                    function(err, results, fields){
                                    

                                    if(err){
                                        return connection.rollback(function(){
                                            connection.release();
                                            reject(err);
                                        });
                                    }

                                    if(isFeatured)
                                        query2Params.item_id = results.insertId;

                                    connection.query(query2, query2Params,
                                            function(err, results, fields){

                                            if(err){
                                                return connection.rollback(function(){
                                                    connection.release();
                                                    reject(err);
                                                });
                                            }

                                            connection.commit(function(err){
                                                if(err){
                                                    return connection.rollback(function(){
                                                        connection.release();
                                                        reject(err);
                                                    });
                                                }

                                                resolve(results);
                                            });
                                        }
                                    );
                                }
                            );


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

    trackSponsoredAdImpression : function(savedSearchIds, ip, userAgent, userId, advertiserIds){
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
                        'actor_type_id, item_id, actor_id, ip_address, user_agent, device_version, advertiser_id) ' +
                        'VALUES ('+ ITEM_SPONSORED_AD +', '+ ACTIVITY_IMPRESSION +
                        ', '+ actor_type_id +', '+ savedSearchIds[i].insertId +
                        ', '+ userId +',\''+ ip +'\',\''+ userAgent.user_agent +'\',\''+ 
                        userAgent.device_version + '\',' + advertiserIds[i] +');';
                        }
                    } else {
                        query += 'INSERT INTO ppc_analytics (item_type_id, activity_type_id, ' + 
                        'actor_type_id, item_id, actor_id, ip_address, user_agent, device_version, advertiser_id) ' +
                        'VALUES ('+ ITEM_SPONSORED_AD +', '+ ACTIVITY_IMPRESSION +
                        ', '+ actor_type_id +', '+ savedSearchIds.insertId +
                        ', '+ userId +',\''+ ip +'\',\''+ userAgent.user_agent +'\',\''+ 
                        userAgent.device_version + '\',' + advertiserIds[0] +');';
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
                        'actor_type_id, item_id, actor_id, ip_address, user_agent, device_version, advertiser_id) ' +
                        'VALUES ('+ ITEM_DAILY_DEAL +', '+ ACTIVITY_IMPRESSION +
                        ', '+ actor_type_id +', '+ deals[i].deal_id +
                        ', '+ userId +',\''+ ip +'\',\''+ userAgent.user_agent +'\',\''+ 
                        userAgent.device_version + '\',' + deals[i].advertiser_id +');';
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
                                advertiser_id: deal.advertiser_id,
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
                                advertiser_id: deal.advertiser_id,
                                actor_id: userId,
                                ip_address: ip,
                                user_agent: userAgent.user_agent,
                                device_version: userAgent.device_version,
                                activity_type_id: ACTIVITY_DOWNLOAD,
                                item_type_id: ITEM_DAILY_DEAL,
                                fraudulent: deal.fraudulent,
                                ppc_analytics_status: deal.ppc_analytics_status
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
                'dd.advertiser_id, ' +
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
                            return reject(new appError('No deal found.'));

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
                            return reject(new appError('No flex offer search found with this id.'));

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