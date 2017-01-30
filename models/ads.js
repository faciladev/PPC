var mysql = require('mysql');
var Promise = require('promise');

var DbHelper = require('../lib/DbHelper');
var DateHelper = require('../lib/DateHelper');

module.exports = {

    getAll : function(){
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                connection.query('SELECT * FROM ppc_ads',
                    function (err, rows, fields) {
                        connection.release();
                        if(err){
                            reject(err);
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
    get: function(id) {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                connection.query('SELECT * FROM ppc_ads where id = ? LIMIT 1', [id],
                    function (err, rows, fields) {
                        connection.release();
                        if(err){
                            reject(err);
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
    getMicrosite: function(ad_id) {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                connection.query('SELECT * FROM ppc_ad_microsites where ad_id = ? LIMIT 1', [ad_id],
                    function (err, rows, fields) {
                        connection.release();
                        if(err){
                            reject(err);
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
    saveAd: function(ad) {
        console.log(ad);
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                if(ad.id == 0 ) {
                    ad.created_at = DateHelper.today();
                    ad.updated_at = DateHelper.today();
                    connection.query('INSERT INTO ppc_ads SET ?', [ad],
                        function (err, rows, fields) {
                            connection.release();
                            if(err){
                                reject(err);
                            }
                            resolve(rows);
                        }
                    );
                } else {
                    ad.updated_at = DateHelper.today();
                    connection.query('Update ppc_ads SET ? WHERE id = ?', [ad, ad.id],
                        function (err, rows, fields) {
                            connection.release();
                            if(err){
                                reject(err);
                            }
                            resolve(rows);
                        }
                    );
                }

            }, function(error){
                if(error)
                    reject(new Error('Connection error'));
            });
        });
    }

}
