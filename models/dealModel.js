var Promise = require('promise');

var DbHelper = require('../lib/DbHelper');
var Util = require('../lib/util');

var dealModel = {
	saveDeal: function(deal, dealMicrosite){
		return new Promise(function(resolve, reject) {

            DbHelper.getConnection().then(function(connection){

            	connection.beginTransaction(function(err) {
				  if (err) { 
				  	connection.release();
				  	reject(err);
				  }

				  connection.query('INSERT INTO ppc_deal_microsites SET ?', [dealMicrosite], function (error, results, fields) {
				    if (error) {
				      return connection.rollback(function() {
				  		connection.release();
				        reject(error);
				      });
				    }

				    var micrositeId = results.insertId;
				    deal.daily_deal_microsite_id = micrositeId;

				    connection.query('INSERT INTO ppc_daily_deal SET ?', [deal], function (error, results, fields) {
				      if (error) {
				        return connection.rollback(function() {
				        	connection.release();
				          	reject(error);
				        });
				      }
				      var dealId = results.insertId;
				      connection.commit(function(err) {
				        if (err) {
				          return connection.rollback(function() {
				          	connection.release();
				            reject(err);
				          });
				        }
				        connection.release();
				        resolve(dealId);
				      });
				    });
				  });
				});
                
            }, function(error){
                if(error)
                    reject(error);
            });

            
        });
	},

	getDealById : function(dealId){

        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){

                var query = 'SELECT dd.id AS deal_id, m.id AS microsite_id, m.name, m.company_name, m.what_you_get, m.location,' +
                    'm.end_date, m.discount_daily_description, m.discount_type, m.discount_percentage, m.discount_description, ' +
                    'm.regular_price, m.discount_rate, dd.coupon_name, dd.coupon_generated_code, m.image, dd.deal_image, ' +
                    'm.discount_description, m.daily_deal_description, m.approved_category FROM daily_deal AS dd LEFT JOIN daily_deal_microsite ' +
                    'AS m ON dd.daily_deal_microsite_id=m.id ' +
                    'WHERE m.is_deleted=0 ' + 
                    'AND dd.id = ?';

                connection.query(
                    query, 
                    [dealId],
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

    getAllDeals : function(){

        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){

                var query = 'SELECT dd.id AS deal_id, m.id AS microsite_id, m.name, m.company_name, m.what_you_get, m.location,' +
                    'm.end_date, m.discount_daily_description, m.discount_type, m.discount_percentage, m.discount_description, ' +
                    'm.regular_price, m.discount_rate, dd.coupon_name, dd.coupon_generated_code, m.image, dd.deal_image, ' +
                    'm.discount_description, m.daily_deal_description, m.approved_category FROM ppc_daily_deal AS dd LEFT JOIN ppc_deal_microsites ' +
                    'AS m ON dd.daily_deal_microsite_id=m.id ' +
                    'WHERE m.is_deleted=0';

                connection.query(
                    query, 
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

    getSubPages: function(){
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){

                connection.query(
                    'SELECT * FROM sub_page', 
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

module.exports = dealModel;