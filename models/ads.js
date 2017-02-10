var mysql = require('mysql');
var Promise = require('promise');

var DbHelper = require('../lib/DbHelper');
var PaginationHelper = require('../lib/PaginationHelper');
var DateHelper = require('../lib/DateHelper');

module.exports = {

    getAll : function(page){
        return new Promise(function(resolve, reject) {
            var query = 'SELECT ppc_ads.id, ppc_ads.advertiser_id, ppc_ads.business_id, ppc_ads.ad_type, ppc_ads.url, ppc_ads.budget_limit, ppc_ads.budget_period, ppc_ads.target_audience, ppc_ads.title, ppc_ads.address, ' +
                        'ppc_ads.lat, ppc_ads.lng, ppc_ads.phone_no, ppc_ads.ad_text, ppc_ads.is_approved, ppc_ad_microsites.name, ppc_ad_microsites.business_name, ppc_ad_microsites.image, ppc_ad_microsites.address_1, ' +
                        'ppc_ad_microsites.address_2, ppc_ad_microsites.state, ppc_ad_microsites.city, ppc_ad_microsites.zipcode, ppc_ad_microsites.phone_number, ppc_ad_microsites.start_day, ' +
                        'ppc_ad_microsites.end_day, ppc_ad_microsites.start_hour, ppc_ad_microsites.end_hour, ppc_ad_microsites.weekend_start_day, ppc_ad_microsites.weekend_end_day, ppc_ad_microsites.weekend_start_hour, ppc_ad_microsites.weekend_end_hour ' +
                        'FROM ppc_ads INNER JOIN ppc_ad_microsites ON ppc_ads.id = ppc_ad_microsites.ad_id WHERE ppc_ads.is_deleted = 0';

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
    getAdOffers: function(ad_id) {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection) {
                connection.query('SELECT * FROM ppc_ad_offers where ad_id = ?', [ad_id],
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

    //Gets Category Keywords
    getCategoryKeywords: function(category_id) {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection) {
                connection.query('Select * from ppc_keywords_categories INNER JOIN ppc_keywords ON ppc_keywords_categories.keyword_id = ppc_keywords.id WHERE ppc_keywords_categories.category_id = ?', [category_id],
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
    //Gets all categories
    getCategories: function() {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection) {
                connection.query('Select * from ppc_keyword_categories',
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
    },
    saveKeywords: function(category_id, keywords) {
        var insertedData = [];
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(function(connection){
                if(keywords != null){
                    keywords.forEach(function(objKeyword, i){
                        var post = {keyword: objKeyword.keyword, price: objKeyword.price, created_by: objKeyword.created_by};
                        connection.query("SELECT id FROM ppc_keywords WHERE keyword = ?", [post.keyword], function(err, rows, fields){
                            if(err) throw err;
                            if(typeof rows == 'undefined' || rows.length <= 0 || rows[0].id == null){
                                connection.query('INSERT INTO ppc_keywords SET ?', [post], function(err, result) {
                                    if(err) throw err;
                                    post.id = result.insertId;
                                    if(category_id != null){
                                        connection.query("INSERT INTO ppc_keywords_categories SET ?",[{category_id: category_id, keyword_id: post.id}],
                                            function (err, rows, fields) {
                                            })
                                    }
                                    insertedData.push(post);
                                    if(i== keywords.length -1) {
                                        resolve(insertedData);
                                    }
                                });
                            } else {
                                if(i== keywords.length -1 && insertedData.length == 0) {
                                    resolve({status: false, message: 'Duplicate Keyword'});
                                }
                            }
                        });
                    });
                }
                connection.release();
            }, function(error){
                if(error)
                    reject(new Error('Connection error'));
            });
        });

    },

    saveAdOffers: function(ad_id,ad_offers) {
        var insertedData = [];
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                ad_offers.forEach(function(objOffer, i){
                    var post = {ad_id: objOffer.ad_id, offer_id: objOffer.offer_id };

                    connection.query('INSERT INTO ppc_ad_offers SET ?', [post],
                        function (err, result) {
                            if(err){
                                reject(err);
                            }
                            post.id = result.insertId;
                            insertedData.push(post);
                            if(i== ad_offers.length -1) {
                                resolve(insertedData);
                            }
                        }
                    );
                });
                connection.release();
            }, function(error){
                if(error)
                    reject(new Error('Connection error'));
            });
        });
    },
    saveAdvertiserOffer: function(advertiser_id, advertiser_offer) {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                connection.query('INSERT INTO ppc_offers SET ?', [advertiser_offer],
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
    saveAdFiles: function(ad_id,ad_file) {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                connection.query('INSERT INTO ppc_ad_files SET ?', [ad_file],
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
    }
}
