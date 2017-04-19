var Promise = require('bluebird');

var DbHelper = require('../lib/DbHelper');
var PaginationHelper = require('../lib/PaginationHelper');
var Util = require('../lib/util');
var ppcModel = require('./ppcModel');
var appError = require('../app_error');

var dealModel = {
    
    partialUpdateDeal: function(dealId, deal, microsite){
        return new Promise(function(resolve, reject){
            microsite = microsite || false;

            DbHelper.getConnection().then(
                function(connection){

                    connection.beginTransaction(function(err){
                        if(err){
                            connection.release();
                            return reject(err);
                        }

                        connection.query('UPDATE ppc_daily_deal SET ? WHERE id = ?', 
                            [deal, dealId], 
                            function (error, results, fields) {
                                if(error){
                                    return connection.rollback(function(){
                                        connection.release();
                                        reject(error);
                                    });
                                }

                                if(microsite){
                                    //Update with microsite data
                                    connection.query('SELECT daily_deal_microsite_id FROM ppc_daily_deal WHERE id = ?', 
                                        [dealId], 
                                        function(error, results, fields){
                                            if(error){
                                                return connection.rollback(function(){
                                                    connection.release();
                                                    reject(error);
                                                });
                                            }

                                            if(results.length <= 0){
                                                return connection.rollback(function(){
                                                    connection.release();
                                                    reject(new appError('No microsite to update.'));
                                                });
                                            }

                                            var micrositeId = results[0].daily_deal_microsite_id;
                                            connection.query('UPDATE ppc_deal_microsites SET ? WHERE id = ?', 
                                                [microsite, micrositeId], 
                                                function (error, results, fields) {
                                                    if(error){
                                                        return connection.rollback(function(){
                                                            connection.release();
                                                            reject(error);
                                                        });
                                                    }

                                                    connection.commit(function(err){
                                                        if(err){
                                                            return connection.rollback(function(){
                                                                connection.release();
                                                                reject(err);
                                                            });
                                                        }

                                                        resolve(results.affectedRows);
                                                    });
                                                }
                                            );
                                        }
                                    )
                                } else {
                                    //Update without microsite data
                                    connection.commit(function(err){
                                        if(err){
                                            return connection.rollback(function(){
                                                connection.release();
                                                reject(err);
                                            });
                                        }

                                        connection.release();
                                        resolve(results.affectedRows);
                                    });
                                }
                            }
                        );

                    });
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

                        resolve(rows.affectedRows);
                    }
                );
            }, function(error){
                    reject(error);
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
                                resolve(results.insertId);
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
                            return reject(new appError('No microsite found for this ad.'));
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
                                resolve(results.affectedRows);
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
                'dd.paused, ' +
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

    getAllDeals : function(page, include){
        include = include || null;

        return new Promise(function(resolve, reject) {
            let query = '';
            if(include === 'downloads') {
                query += '\
                SELECT \
                    dd.id,\
                    dd.deal_image AS image,\
                    mi.name,\
                    dd.budget_limit,\
                    dd.budget_period,\
                    dd.paused,\
                    COUNT(ppc_analytics.id) AS downloads,\
                    dd.budget_limit - (COUNT(ppc_analytics.id) * dd.download_price) AS available_fund,\
                    dd.approved_category_id,\
                    dd.download_price,\
                    dd.date_created,\
                    dd.is_approved\
                FROM\
                    ppc_daily_deal AS dd\
                        LEFT JOIN\
                    ppc_analytics ON ppc_analytics.item_id = dd.id\
                        AND ppc_analytics.item_type_id = ?\
                        AND ppc_analytics.activity_type_id = ?\
                        AND IF(dd.budget_period = \'daily\',\
                        ppc_analytics.activity_time BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 1 DAY),\
                        ppc_analytics.activity_time BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY))\
                        JOIN\
                    ppc_deal_microsites AS mi ON dd.daily_deal_microsite_id = mi.id\
                WHERE\
                    dd.is_deleted = 0\
                GROUP BY dd.id\
                ORDER BY dd.id DESC';
            } else {
                query += '\
                SELECT \
                    dd.id,\
                    dd.deal_image AS image,\
                    mi.name,\
                    dd.budget_limit,\
                    dd.budget_period,\
                    dd.paused,\
                    dd.approved_category_id,\
                    dd.download_price,\
                    dd.date_created,\
                    dd.is_approved\
                FROM\
                    ppc_daily_deal AS dd\
                        JOIN\
                    ppc_deal_microsites AS mi ON dd.daily_deal_microsite_id = mi.id\
                WHERE\
                    dd.is_deleted = 0\
                GROUP BY dd.id\
                ORDER BY dd.id DESC';
            }

            PaginationHelper.paginate(
                query, 
                page, 
                null, 
                [
                    ppcModel.ITEM_DAILY_DEAL, 
                    ppcModel.ACTIVITY_DOWNLOAD,
                    Util.firstDay(), 
                    Util.lastDay()
                ]
                ).then(
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
            'dd.budget_period, '+
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
            'dd.paused, ' +
            'COUNT(ppc_analytics.id) AS downloads, ' +
            'dd.budget_limit - (COUNT(ppc_analytics.id) * dd.download_price) AS available_fund, ' +
            'dd.is_approved, ' +
            'dd.is_deleted, ' +
            'dd.list_rank, ' +
            'dd.deal_image, ' +
            'm.discount_description, '+
            'm.daily_deal_description, '+
            'dd.approved_category_id '+
            'FROM ppc_daily_deal AS dd ' +
            'LEFT JOIN ' +
            'ppc_analytics ON ppc_analytics.item_id = dd.id '+
            'AND ppc_analytics.item_type_id = ? AND ppc_analytics.activity_type_id = ? ' +
            'AND IF(dd.budget_period = \'daily\',' +
            'ppc_analytics.activity_time BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 1 DAY),' +
            'ppc_analytics.activity_time BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY))' +
            'JOIN ppc_deal_microsites ' +
            'AS m ON dd.daily_deal_microsite_id=m.id ' +
            'JOIN ppc_daily_deal_categories AS cat ON cat.category_id = dd.approved_category_id ' +
            'WHERE dd.is_deleted=0 AND dd.advertiser_id=? GROUP BY dd.id ORDER BY dd.id DESC';

            var queryParams = [
            ppcModel.ITEM_DAILY_DEAL, 
            ppcModel.ACTIVITY_DOWNLOAD, 
            Util.firstDay(), 
            Util.lastDay(),
            advertiserId
            ];
            
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