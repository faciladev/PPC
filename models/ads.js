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

    getAdLocations: function(ad_id) {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection) {
                connection.query('SELECT * from ppc_ad_locations where ad_id = ?', [ad_id],
                    function(err, rows, fields) {
                        connection.release();
                        if(err) {
                            reject(err);
                        }
                        resolve(rows);
                    }
                );
            }, function(error) {
                if(error)
                    reject(new Error('Connection error'));
            });
        });
    },
    getAdMicrosite: function(ad_id) {
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
    getAdKeywords: function(ad_id) {
      return new Promise(function(resolve, reject) {
         DbHelper.getConnection().then(function(connection) {
            connection.query('SELECT * from ppc_ads_keywords where ad_id = ?', [ad_id],
                function(err, rows, fields) {
                    connection.release();
                    if(err) {
                        reject(err);
                    }
                    resolve(rows);
                }
            );
         }, function(error) {
             if(error)
                reject(new Error('Connection error'));
         });
      });
    },
    getAdSubpages: function(ad_id) {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection) {
                connection.query('SELECT * from ppc_ads_subpages where ad_id = ?', [ad_id],
                    function(err, rows, fields) {
                        connection.release();
                        if(err) {
                            reject(err);
                        }
                        resolve(rows);
                    }
                );
            }, function(error) {
                if(error)
                    reject(new Error('Connection error'));
            });
        });
    },


    saveAd: function(ad) {
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
    },
    saveAdMicrosite: function(ad_id, ad_microsite) {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                connection.query('DELETE FROM ppc_ad_microsites WHERE ad_id = ?', [ad_id]);
                connection.query('INSERT INTO ppc_ad_microsites SET ?', [ad_microsite],
                    function (err, rows, fields) {
                        if(err){
                            reject(err);
                        }
                        resolve(rows);
                    }
                );
                connection.release();
            }, function(error){
                if(error)
                    reject(new Error('Connection error'));
            });
        });
    },
    saveAdKeywords: function(ad_id, ad_keywords) {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                connection.query('DELETE FROM ppc_ads_keywords WHERE ad_id = ?', [ad_id]);
                for(var i=0; i< ad_keywords.length; i++) {
                    connection.query('INSERT INTO ppc_ads_keywords SET ?', [ad_keywords[i]],
                        function (err, rows, fields) {
                            if(err){
                                reject(err);
                            }
                            resolve(rows);
                        }
                    );
                }
                connection.release();
            }, function(error){
                if(error)
                    reject(new Error('Connection error'));
            });
        });
    },
    saveAdSubPages: function(ad_id,ad_subPages) {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                connection.query('DELETE FROM ppc_ads_subpages WHERE ad_id = ?', [ad_id]);
                for(var i=0; i< ad_subPages.length; i++) {
                    connection.query('INSERT INTO ppc_ads_subpages SET ?', [ad_subPages[i]],
                        function (err, rows, fields) {
                            if(err){
                                reject(err);
                            }
                            resolve(rows);
                        }
                    );
                }
                connection.release();
            }, function(error){
                if(error)
                    reject(new Error('Connection error'));
            });
        });
    },
    saveAdLocations: function(ad_id,ad_locations) {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                connection.query('DELETE FROM ppc_ad_locations WHERE ad_id = ?', [ad_id]);
                for(var i=0; i< ad_locations.length; i++) {
                    connection.query('INSERT INTO ppc_ad_locations SET ?', [ad_locations[i]],
                        function (err, rows, fields) {
                            if(err){
                                reject(err);
                            }
                            resolve(rows);
                        }
                    );
                }
                connection.release();
            }, function(error){
                if(error)
                    reject(new Error('Connection error'));
            });
        });
    }
}
