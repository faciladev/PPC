var Promise = require('promise');

var DbHelper = require('../lib/DbHelper');
var PaginationHelper = require('../lib/PaginationHelper');
var Util = require('../lib/util');
var ppcModel = require('./ppcModel');

var dealModel = {
    approveDeal: function(dealId, deal){
        return new Promise(function(resolve, reject){
            
            DbHelper.getConnection().then(
                function(connection){
                    connection.query('UPDATE ppc_daily_deal SET ? WHERE id = ?',
                        [deal, dealId],
                        function(err, results, fields){
                            if(err)
                                return reject(err);

                            resolve(results);
                        }
                    );
                }, 
                function(error){
                    reject(error);
                }
            );
        });
    },

    deleteDeal: function(dealId){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(function(connection){
                connection.query('UPDATE ppc_daily_deal SET is_deleted = 1 where id = ?', [dealId],
                    function (err, rows, fields) {
                        connection.release();
                        if(err){
                            return reject(err);
                        }

                        resolve(rows);
                    }
                );
            }, function(error){
                if(error)
                    reject(new Error('Connection error'));
            });
        });
    },

	saveDeal: function(deal, dealMicrosite){
		return new Promise(function(resolve, reject) {

            Util.getAddressLatLng(dealMicrosite.location).then(
                function(location){
                    if(location !== false){
                        dealMicrosite.lat = location.lat;
                        dealMicrosite.lng = location.lng;
                    }

                    DbHelper.getConnection().then(function(connection){

                        connection.beginTransaction(function(err) {
                          if (err) { 
                            connection.release();
                            return reject(err);
                          }

                          connection.query('INSERT INTO ppc_deal_microsites SET ?', [dealMicrosite], function (error, results, fields) {
                            if (error) {
                              return connection.rollback(function() {
                                connection.release();
                                return reject(error);
                              });
                            }

                            var micrositeId = results.insertId;
                            deal.daily_deal_microsite_id = micrositeId;
                            deal.approved_category_id = deal.suggested_category_id;
                            deal.start_date = deal.start_date.substring(0,10);
                            deal.end_date = deal.end_date.substring(0,10);

                            connection.query('INSERT INTO ppc_daily_deal SET ?', [deal], function (error, results, fields) {
                              if (error) {
                                return connection.rollback(function() {
                                    connection.release();
                                    return reject(error);
                                });
                              }
                              var dealId = results.insertId;
                              connection.commit(function(err) {
                                if (err) {
                                  return connection.rollback(function() {
                                    connection.release();
                                    return reject(err);
                                  });
                                }
                                connection.release();
                                resolve(results);
                              });
                            });
                          });
                        });
                        
                    }, function(error){
                        reject(error);
                    });
                },
                function(error){
                    reject(error);
                }
            );

                    

            
        });
	},

    updateDeal: function(dealId, deal, dealMicrosite){
        return new Promise(function(resolve, reject) {

            DbHelper.getConnection().then(function(connection){
                connection.query('SELECT daily_deal_microsite_id FROM ppc_daily_deal WHERE id = ?', 
                    [dealId], 
                    function(error, results, fields){
                        if(error){
                            connection.release();
                            return reject(error);
                        }

                        if(results.length < 1){
                            connection.release();
                            return reject(new Error('No microsite found for this ad.'));
                        }

                        var micrositeId = results[0].daily_deal_microsite_id;

                        connection.beginTransaction(function(err) {
                          if (err) { 
                            connection.release();
                            return reject(err);
                          }

                          connection.query('UPDATE ppc_deal_microsites SET ? WHERE id = ?', 
                            [dealMicrosite, micrositeId], 
                            function (error, results, fields) {
                            if (error) {
                              return connection.rollback(function() {
                                connection.release();
                                return reject(error);
                              });
                            }
                            if(typeof deal.start_date !== "undefined" && deal.start_date !== null)
                                deal.start_date = deal.start_date.substring(0,10);
                            if(typeof deal.end_date !== "undefined" && deal.end_date !== null)
                                deal.end_date = deal.end_date.substring(0,10);

                            connection.query('UPDATE ppc_daily_deal SET ? WHERE id = ?', [deal, dealId], function (error, results, fields) {
                              if (error) {
                                return connection.rollback(function() {
                                    connection.release();
                                    return reject(error);
                                });
                              }
                              connection.commit(function(err) {
                                if (err) {
                                  return connection.rollback(function() {
                                    connection.release();
                                    return reject(err);
                                  });
                                }
                                connection.release();
                                resolve(results);
                              });
                            });
                          });

                        });

                    }
                );

                        
                
            }, function(error){
                reject(error);
            });

            
        });
    },

    getDealCategories: function(){
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){

                var query = 'SELECT category_id, category_name FROM ppc_daily_deal_categories';

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
    },

	getDealById : function(dealId){

        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                var query = 'SELECT ' + 
                'cat.category_name, ' +
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
                'dd.budget_limit, ' +
                'dd.coupon_image, ' +
                'dd.budget_period, '+
                'dd.advertiser_id, ' +
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
                'm.lat, m.lng, ' +
                'dd.approved_category_id, ' +
                'dd.suggested_category_id, ' +
                'm.code, ' +
                'm.city, m.state_id, m.zip_code, usa_states.usa_state_name ' +
                'FROM ppc_daily_deal AS dd LEFT JOIN ppc_deal_microsites ' +
                'AS m ON dd.daily_deal_microsite_id=m.id ' +
                'JOIN ppc_daily_deal_categories AS cat ON cat.category_id = dd.approved_category_id ' +
                'JOIN usa_states ON m.state_id = usa_states.usa_state_id ' +
                'WHERE dd.is_deleted=0 AND dd.id=? ';

                connection.query(
                    query, 
                    [dealId],
                    function (err, rows, fields) {

                        //release connection
                        connection.release();

                        if(err){
                            return reject(err);
                        }

                        if(rows.length > 0)
                            resolve(rows[0]);
                        else
                            resolve(rows);
                    }
                );
            }, function(error){
                reject(error);
            });

            
        });
    },

    getAllDeals : function(page){

        return new Promise(function(resolve, reject) {

            var query = 'SELECT dd.id, dd.deal_image AS image, mi.name, dd.approved_category_id, ' + 
            'dd.download_price, dd.date_created, dd.is_approved ' +
            'FROM ppc_daily_deal AS dd JOIN ppc_deal_microsites AS mi ON ' +
            'dd.daily_deal_microsite_id = mi.id ' +
            'WHERE dd.is_deleted=0';

            PaginationHelper.paginate(query, page).then(
                function(result){
                    resolve(result);
                }, 
                function(error){
                    reject(error);
                }
            );

            
        });
    },

    getAllDealsByAdvertiser : function(advertiserId, page){

        return new Promise(function(resolve, reject) {

            var query = 
            'SELECT ' + 
            'cat.category_name, ' +
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
            'dd.budget_limit, ' +
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
            'JOIN ppc_daily_deal_categories AS cat ON cat.category_id = dd.approved_category_id ' +
            'WHERE dd.is_deleted=0 AND dd.advertiser_id=? ';

            var queryParams = [advertiserId];
            
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

    getSubPages: function(){
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){

                connection.query(
                    'SELECT * FROM sub_page', 
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

module.exports = dealModel;