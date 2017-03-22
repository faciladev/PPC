var mysql = require('mysql');
var Promise = require('promise');

var DbHelper = require('../lib/DbHelper');
var PaginationHelper = require('../lib/PaginationHelper');
var DateHelper = require('../lib/DateHelper');
var Util = require('../lib/util');
var ppcModel = require('./ppcModel');

module.exports = {
    partialUpdateAd: function(adId, ad, microsite){
        return new Promise(function(resolve, reject){
            microsite = microsite || false;

            DbHelper.getConnection().then(
                function(connection){

                    connection.beginTransaction(function(err){
                        if(err){
                            connection.release();
                            return reject(err);
                        }

                        connection.query('UPDATE ppc_ads SET ? WHERE id = ?', 
                            [ad, adId], 
                            function (error, results, fields) {
                                if(error){
                                    return connection.rollback(function(){
                                        connection.release();
                                        reject(error);
                                    });
                                }

                                if(microsite){
                                    //Update with microsite data
                                    connection.query('SELECT id FROM ppc_ad_microsites WHERE ad_id = ?', 
                                        [adId], 
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
                                                    reject(new Error('No microsite to update.'));
                                                });
                                            }

                                            var micrositeId = results[0].id;
                                            connection.query('UPDATE ppc_ad_microsites SET ? WHERE id = ?', 
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

                                                        resolve(results);
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
                                        resolve(results);
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

    getAll : function(page, search, type){
        return new Promise(function(resolve, reject) {
            var queryParams = [];
            var query = 'SELECT ppc_ads.id, ppc_ads.advertiser_id, ' +
                'COUNT(ppc_ad_searches.id) AS clicks,' +
                'ppc_ads.budget_limit - SUM(ppc_ad_searches.price) AS available_fund,' +
                'advertisers.advertizer_business_name, ppc_ads.business_id, ppc_ads.ad_type, ppc_ads.url, ppc_ads.budget_limit, ppc_ads.budget_period, ppc_ads.target_audience, ppc_ads.title, ppc_ads.address, ' +
                'ppc_ads.lat, ppc_ads.lng,ppc_ads.is_featured, ppc_ads.phone_no, ppc_ads.paused, ppc_ads.ad_text, ppc_ads.is_approved, ppc_ad_microsites.name, ppc_ad_microsites.business_name, ppc_ad_microsites.address_1, ' +
                'ppc_ad_microsites.address_2, ppc_ad_microsites.state, ppc_ad_microsites.city, ppc_ad_microsites.zipcode, ppc_ad_microsites.phone_number, ppc_ad_microsites.start_day, ' +
                'ppc_ad_microsites.end_day, ppc_ad_microsites.start_hour, ppc_ad_microsites.end_hour, ppc_ad_microsites.weekend_start_day, ppc_ad_microsites.weekend_end_day, ppc_ad_microsites.weekend_start_hour, ppc_ad_microsites.weekend_end_hour ' +
                'FROM ppc_ads JOIN advertisers on ppc_ads.advertiser_id = advertisers.advertizer_id ' +
                
                'JOIN ppc_ad_microsites ON ppc_ads.id = ppc_ad_microsites.ad_id  ' +
                'LEFT JOIN ppc_ad_searches ON ppc_ad_searches.ad_id = ppc_ads.id '+
                'AND ppc_ad_searches.clicked = 1 ' +
                'LEFT JOIN ppc_analytics ON ' +
                'ppc_ad_searches.id = ppc_analytics.item_id '+
                'AND ppc_analytics.item_type_id = ' + ppcModel.ITEM_SPONSORED_AD + 
                ' AND ppc_analytics.activity_type_id = ' + ppcModel.ACTIVITY_CLICK +
                ' AND IF(ppc_ads.budget_period = \'daily\', ' +
                'ppc_analytics.activity_time BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 1 DAY),' +
                'ppc_analytics.activity_time BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)) ' +   
                'WHERE ppc_ads.is_deleted = 0 ';

                queryParams.push(
                    Util.firstDay(), 
                    Util.lastDay()
                );

            if(typeof search != "undefined" && search != null){
                query += ' AND (ppc_ad_microsites.name LIKE ? OR ppc_ads.ad_text LIKE ? OR ppc_ads.title LIKE ? )';
                queryParams.push('%' + search + '%', '%' + search + '%', '%' + search + '%');
            }

            if(typeof type != "undefined" && type != null && (type === "approved" || type === "unapproved")){
                type = (type === "approved" ? 1 : 0);
                query += ' AND is_approved = ?';
                queryParams.push(type);
            }

            query += " GROUP BY ppc_ads.id, ppc_ad_microsites.id ORDER BY ppc_ads.id DESC";


            PaginationHelper.paginate(query, page, null, queryParams).then(
                function(result){
                    if(result.result <= 0)
                        return resolve(result);

                    var ads = result.result;
                    for(var i = 0; i<ads.length; i++){
                        (function(i){
                            module.exports.getAdLocations(ads[i].id).then(function(response){
                                ads[i].locations = response;
                                module.exports.getAdKeywords(ads[i].id).then(function(response){
                                    ads[i].keywords = response;

                                    module.exports.getAdSubpages(ads[i].id).then(function(response){
                                        ads[i].subpages = response;
                                        if(i === ads.length - 1)
                                            return resolve(result);

                                    }, function(error){
                                        return reject(error);
                                    });

                                }, function(error){
                                    return reject(error);
                                });
                            }, function(error){
                                return reject(error);
                            });
                        })(i);                          
                    }
                },
                function(error){
                    reject(error);
                }
            );
        });
    },

    getFeatured: function(subPage){
        return new Promise(function(resolve, reject){

            if(isNaN(subPage))
                return reject(new Error('Invalid subpage id.'));

            var query = 'SELECT ' +
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
                'ppc_ads_subpages.sub_page_id, ' +
                'ppc_ads.ad_text ' +
            'FROM ' +
                'ppc_ads ' +
                    'JOIN ' +
                'ppc_ad_microsites ON ppc_ad_microsites.ad_id = ppc_ads.id ' +
                    'JOIN ' +
                '(SELECT DISTINCT ' +
                    'ad_id ' +
                'FROM ' +
                    'available_ad_keywords) AS available_ad_keywords ON available_ad_keywords.ad_id = ppc_ads.id ' +
                    'JOIN ' +
                '(SELECT  ' +
                    'ad_id, sub_page_id ' +
                'FROM ' +
                    'ppc_ads_subpages) AS ppc_ads_subpages ON ppc_ads_subpages.ad_id = ppc_ads.id ' +
                    'JOIN ' +
                'usa_states ON usa_states.usa_state_id = ppc_ad_microsites.state ' +
            'WHERE ' +
                'ppc_ads.is_featured = 1 ' +
                    'AND ppc_ads.is_approved = 1 ' +
                    'AND ppc_ads.is_deleted = 0 ' +
                    'AND ppc_ads.paused = 0 ' +
                    'AND ppc_ads_subpages.sub_page_id = ? ';


            var queryParams = [subPage];

            DbHelper.getConnection().then(
                function(connection){
                    connection.query(query, queryParams, 
                        function(err, rows, fields){
                            connection.release();
                            if(err)
                                return reject(err);

                            resolve(rows);
                        }
                    );
                }, 
                function(error){
                    next(error);
                }
            );
                
            
        });
    },

    getOneFeaturedAd: function(adId, subPageId){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(
                function(connection){
                    var query = 'SELECT '+
                                    'ppc_ads.id AS ad_id, '+
                                    'high_keywords.price, '+
                                    'high_keywords.keyword_id, '+
                                    'available_ad_keywords.keyword_category_id, '+
                                    'ppc_ads_subpages.sub_page_id AS ad_subpage_id '+
                                'FROM '+
                                    'ppc_ads '+
                                        'JOIN '+
                                    'available_ad_keywords ON available_ad_keywords.ad_id = ppc_ads.id '+
                                        'JOIN '+
                                    'ppc_ads_subpages ON ppc_ads_subpages.ad_id = ppc_ads.id '+
                                        'JOIN '+
                                    '(SELECT  '+
                                        'available_ad_keywords.keyword_id, '+
                                            'MAX(available_ad_keywords.price) AS price '+
                                    'FROM '+
                                        'available_ad_keywords '+
                                    'GROUP BY available_ad_keywords.keyword_id '+
                                    'ORDER BY price DESC) AS high_keywords ON high_keywords.keyword_id = available_ad_keywords.keyword_id '+
                                'WHERE '+
                                    'ppc_ads.id = ? '+
                                        'AND ppc_ads_subpages.sub_page_id = ? '+
                                'ORDER BY price DESC '+
                                'LIMIT 1';
                                
                    connection.query(query, 
                        [adId, subPageId], 
                        function(err, rows, fields){
                            connection.release();
                            if(err)
                                return reject(err);

                            resolve((rows.length > 0)? rows[0] : {});
                        }
                    );
                }, 
                function(error){
                    next(error);
                }
            );
        });
    },

    getAllByAdvertiser : function(page, advertiserId, search, type){
        return new Promise(function(resolve, reject) {
            var queryParams = [];
            var query = 'SELECT ppc_ads.id, ppc_ads.advertiser_id, '+
                'COUNT(ppc_ad_searches.id) AS clicks,' +
                'ppc_ads.budget_limit - SUM(ppc_ad_searches.price) AS available_fund,' +
                'advertizer_business_name, ppc_ads.business_id, ppc_ads.ad_type, ppc_ads.url, ppc_ads.budget_limit, ppc_ads.budget_period, ppc_ads.target_audience, ppc_ads.title, ppc_ads.address, ' +
                'ppc_ads.lat, ppc_ads.lng, ppc_ads.is_featured, ppc_ads.phone_no, ppc_ads.paused, ppc_ads.ad_text, ppc_ads.is_approved, ppc_ad_microsites.name, ppc_ad_microsites.business_name, ppc_ad_microsites.address_1, ' +
                'ppc_ad_microsites.address_2, ppc_ad_microsites.state, ppc_ad_microsites.city, ppc_ad_microsites.zipcode, ppc_ad_microsites.phone_number, ppc_ad_microsites.start_day, ' +
                'ppc_ad_microsites.end_day, ppc_ad_microsites.start_hour, ppc_ad_microsites.end_hour, ppc_ad_microsites.weekend_start_day, ppc_ad_microsites.weekend_end_day, ppc_ad_microsites.weekend_start_hour, ppc_ad_microsites.weekend_end_hour ' +
                'FROM ppc_ads JOIN advertisers on ppc_ads.advertiser_id = advertisers.advertizer_id ' +
                'Left outer JOIN ppc_ad_microsites ON ppc_ads.id = ppc_ad_microsites.ad_id  ' +
                'LEFT JOIN ppc_ad_searches ON ppc_ad_searches.ad_id = ppc_ads.id '+
                'AND ppc_ad_searches.clicked = 1 ' +
                'LEFT JOIN ppc_analytics ON ' +
                'ppc_ad_searches.id = ppc_analytics.item_id '+
                'AND ppc_analytics.item_type_id = ' + ppcModel.ITEM_SPONSORED_AD + 
                ' AND ppc_analytics.activity_type_id = ' + ppcModel.ACTIVITY_CLICK +
                ' AND IF(ppc_ads.budget_period = \'daily\', ' +
                'ppc_analytics.activity_time BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 1 DAY),' +
                'ppc_analytics.activity_time BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)) ' +    
                'WHERE ppc_ads.is_deleted = 0 AND ppc_ads.advertiser_id = ?';

            queryParams.push(
                    Util.firstDay(), 
                    Util.lastDay()
                );

            if(typeof search != "undefined" && search != null){
                query += ' AND (ppc_ad_microsites.name LIKE ? OR ppc_ads.ad_text LIKE ? OR ppc_ads.title LIKE ? )';
                queryParams.push('%' + search + '%', '%' + search + '%', '%' + search + '%');
            }

            if(typeof type != "undefined" && type != null && (type === "approved" || type === "unapproved")){
                type = (type === "approved" ? 1 : 0);
                query += ' AND is_approved = ?';
                queryParams.push(type);
            }

            queryParams.push(advertiserId);

            query += " GROUP BY ppc_ads.id, ppc_ad_microsites.id ORDER BY ppc_ads.id DESC";
            
            PaginationHelper.paginate(query, page, null, queryParams).then(
                function(result){
                    if(result.result <= 0)
                        return resolve(result);

                    var ads = result.result;
                    for(var i = 0; i<ads.length; i++){
                        (function(i){
                            module.exports.getAdLocations(ads[i].id).then(function(response){
                                ads[i].locations = response;
                                module.exports.getAdKeywords(ads[i].id).then(function(response){
                                    ads[i].keywords = response;

                                    module.exports.getAdSubpages(ads[i].id).then(function(response){
                                        ads[i].subpages = response;
                                        if(i === ads.length - 1)
                                            return resolve(result);

                                    }, function(error){
                                        return reject(error);
                                    });

                                }, function(error){
                                    return reject(error);
                                });
                            }, function(error){
                                return reject(error);
                            });
                        })(i);
                    }
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

                        if(rows.length == 0)
                            return resolve(rows);

                        (function(ad){
                            module.exports.getAdLocations(ad.id).then(function(response){
                                if(response.length == 0)
                                {
                                    ad['locations'] = [
                                        {
                                            city: "",
                                            state_id: "",
                                            zip_code: ""
                                        }
                                    ];
                                }
                                else
                                {
                                    ad['locations'] = response;
                                }
                                module.exports.getAdKeywords(ad.id).then(function(response){
                                    ad.keywords = response;

                                    module.exports.getAdSubpages(ad.id).then(function(response){
                                        ad.subpages = response;
                                        return resolve(ad);

                                    }, function(error){
                                        return reject(error);
                                    });

                                }, function(error){
                                    return reject(error);
                                });
                            }, function(error){
                                return reject(error);
                            });
                        })(rows[0]); 
                    }
                );
            }, function(error){
                reject(error);
            });
        });
    },

    updateAd: function(newAdData, adId){
        return new Promise(function(resolve, reject){
            module.exports.get(adId).then(
                function(oldAdData){

                }, 

                function(error){
                    reject(error);
                }
            );
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
                reject(error);
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
                reject(error);
            });
        });
    },
    getAdKeywords: function(ad_id) {
      return new Promise(function(resolve, reject) {
         DbHelper.getConnection().then(function(connection) {
            connection.query('SELECT ppc_ads_keywords.*, ppc_keywords.keyword, ppc_keywords.price, ppc_keywords.created_by ' +
                'FROM ppc_keywords INNER JOIN ppc_ads_keywords ON ppc_keywords.id = ppc_ads_keywords.keyword_id ' +
                'WHERE ad_id = ? ORDER BY keyword', [ad_id],

                function(err, rows, fields) {
                    connection.release();
                    if(err) {
                        reject(err);
                    }
                    resolve(rows);
                }
            );
         }, function(error) {
             reject(error);
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
                reject(error);
            });
        });
    },
    getAdOffers: function(ad_id) {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection) {
                connection.query('SELECT ppc_offers.*, ad_id FROM ppc_ad_offers INNER JOIN ppc_offers ON ppc_ad_offers.offer_id = ppc_offers.id WHERE ad_id = ?', [ad_id],
                    function(err, rows, fields) {
                        connection.release();
                        if(err) {
                            reject(err);
                        }
                        resolve(rows);
                    }
                );
            }, function(error) {
                reject(error);
            });
        });
    },
    getAdFiles: function(ad_id) {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection) {
                connection.query('SELECT ppc_files.*, ad_id FROM ppc_ad_files INNER JOIN ppc_files ON ppc_ad_files.file_id = ppc_files.id WHERE ad_id = ?', [ad_id],
                    function(err, rows, fields) {
                        connection.release();
                        if(err) {
                            reject(err);
                        }
                        resolve(rows);
                    }
                );
            }, function(error) {
                reject(error);
            });
        });
    },

    //Gets Category Keywords
    getCategoryKeywords: function(category_id) {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection) {
                connection.query('Select * from ppc_keywords_categories INNER JOIN ppc_keywords ON ppc_keywords_categories.keyword_id = ppc_keywords.id ' +
                    'WHERE ppc_keywords_categories.category_id = ? ORDER BY keyword', [category_id],
                    function(err, rows, fields) {
                        connection.release();
                        if(err) {
                            reject(err);
                        }
                        resolve(rows);
                    }
                );
            }, function(error) {
                reject(error);
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
                reject(error);
            });
        });
    },
    //Gets all keywords
    getKeywords: function() {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection) {
                connection.query('Select * from ppc_keywords',
                    function(err, rows, fields) {
                        connection.release();
                        if(err) {
                            reject(err);
                        }
                        resolve(rows);
                    }
                );
            }, function(error) {
                reject(error);
            });
        });
    },
    getKeyword: function(id) {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                connection.query('SELECT * FROM ppc_keywords where id = ? LIMIT 1', [id],
                    function (err, rows, fields) {
                        connection.release();
                        if(err){
                            reject(err);
                        }
                        resolve(rows);
                    }
                );
            }, function(error){
                reject(error);
            });
        });
    },

    saveAd: function(ad) {
        return new Promise(function(resolve, reject) {

                Util.getAddressLatLng(ad.address).then(
                    function(location){
                        if(location !== false){
                            ad.lat = location.lat;
                            ad.lng = location.lng;
                        }

                        DbHelper.getConnection().then(function(connection){
                            if(ad.id == 0 ) {
                                ad.created_at = DateHelper.today();
                                ad.updated_at = DateHelper.today();
                                ad.available_since = DateHelper.today();
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
                            reject(error);
                        });

                    },
                    function(error){
                        reject(error);
                    }
                );


        });
    },
    saveAdMicrosite: function(ad_id, ad_microsite) {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
				var query = "DELETE FROM ppc_ad_microsites WHERE ad_id = ? ;"
				query += "INSERT INTO ppc_ad_microsites SET ?";
                connection.query(query, [ad_id, ad_microsite],
                    function (err, rows, fields) {
						connection.release();
                        if(err){
                            reject(err);
                        }
                        resolve(rows);
                    }
                );
                
            }, function(error){
				reject(error);
            });
        });
    },
    saveAdKeywords: function(ad_id, ad_keywords) {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                connection.query('DELETE FROM ppc_ads_keywords WHERE ad_id = ?', [ad_id], function(err, rows, fields){
					if(err){
						connection.release();
						return reject(err);
					}
					
					for(var i=0; i< ad_keywords.length; i++) {
						(function(i, ad_keywords){
							connection.query('INSERT INTO ppc_ads_keywords SET ?', [ad_keywords[i]],
								function (err, rows, fields) {
									if(err){
										connection.release();
										return reject(err);
									}
									if(i === ad_keywords.length - 1){
										connection.query('SELECT ppc_ads_keywords.*, ppc_keywords.keyword, ppc_keywords.price, ppc_keywords.created_by ' +
                                            'FROM ppc_keywords INNER JOIN ppc_ads_keywords ON ppc_keywords.id = ppc_ads_keywords.keyword_id ' +
                                            'WHERE ad_id = ? ORDER BY keyword', [ad_id],
                                            function(err, rows, fields) {
                                                connection.release();
                                                if(err) {
                                                    return reject(err);
                                                }
                                                resolve(rows);
                                            }
                                        );
									}
								}
							);
						})(i, ad_keywords);
                }
				});
                
                
            }, function(error){
                reject(error);
            });
        });
    },
    saveAdSubPages: function(ad_id,ad_subPages) {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                connection.query('DELETE FROM ppc_ads_subpages WHERE ad_id = ?', [ad_id], function(err, rows, fields){
					if(err){
						connection.release();
						return reject(err);
					}
					
					for(var i=0; i< ad_subPages.length; i++) {
						(function(i, ad_subPages){
							connection.query('INSERT INTO ppc_ads_subpages SET ?', [ad_subPages[i]],
							function (err, rows, fields) {
								if(err){
									connection.release();
									return reject(err);
								}
								if(i === ad_subPages.length - 1){
									connection.release();
									resolve(rows);
								}
								
							}
						);
						})(i, ad_subPages);
					}
				});
                
            }, function(error){
                reject(error);
            });
        });
    },
    saveAdLocations: function(ad_id,ad_locations) {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                connection.query('DELETE FROM ppc_ad_locations WHERE ad_id = ?', [ad_id], function(err, rows, fields){
					if(err){
						connection.release();
						return reject(err);
					}
					
					for(var i=0; i< ad_locations.length; i++) {
						(function(i, ad_locations){
							connection.query('INSERT INTO ppc_ad_locations SET ?', [ad_locations[i]],
								function (err, rows, fields) {
									if(err){
										connection.release();
										reject(err);
									}
									if(i === ad_locations.length - 1){
										connection.release();
										resolve(rows);
									}
									
								}
							);
						})(i, ad_locations);
					}
				});
                
            }, function(error){
                reject(error);
            });
        });
    },
    saveKeywords: function(category_id, keywords) {
        var insertedData = [];
        return new Promise(function(resolve, reject){
			if(keywords != null){

				DbHelper.getConnection().then(function(connection){
			
					keywords.forEach(function(objKeyword, i){
						var post = {keyword: objKeyword.keyword, price: objKeyword.price, created_by: objKeyword.created_by};
						connection.query("SELECT id FROM ppc_keywords WHERE keyword = ?", [post.keyword], function(err, rows, fields){
							if(err){
								connection.release();
								return reject(err);
							}
							
							if(typeof rows == 'undefined' || rows.length <= 0 || rows[0].id == null){
								connection.query('INSERT INTO ppc_keywords SET ?', [post], function(err, result) {
									if(err){
										connection.release();
										return reject(err);
									}
									
									post.id = result.insertId;
									if(category_id != null){
										connection.query("INSERT INTO ppc_keywords_categories SET ?",[{category_id: category_id, keyword_id: post.id}],
											function (err, rows, fields) {
												//log unreachable error 
												if(err)
													console.log(err);
											}
										)
									}
									
									insertedData.push(post);
									
									if(i== keywords.length -1) {
										connection.release();
										resolve(insertedData);
									}
								});
							} else {
								if(i== keywords.length -1 && insertedData.length == 0) {
									connection.release();
									resolve({status: false, message: 'Duplicate Keyword'});
								}
							}
						});
					});
			
				}, function(error){
					reject(error);
				});
			} else {
				reject(new Error("Empty Keyword"));
			}
            
        });

    },

    saveAdOffers: function(ad_id,ad_offers) {
        var insertedData = [];
        return new Promise(function(resolve, reject) {

            if(! (ad_offers instanceof Array)  || ad_offers.length <= 0 || isNaN(ad_id))
                return reject(new Error('Invalid ad id or empty ad offer array.'));

            DbHelper.getConnection().then(function(connection){

                connection.query('DELETE FROM ppc_ad_offers WHERE ad_id = ?', [ad_id], function(err, rows, fields){
                    if(err){
                        connection.release();
                        return reject(err);
                    }

                    ad_offers.forEach(function(objOffer, i){
                        var post = {ad_id: objOffer.ad_id, offer_id: objOffer.offer_id };

                        connection.query('INSERT INTO ppc_ad_offers SET ?', [post],
                            function (err, result) {
                                if(err){
                                    connection.release();
                                    return reject(err);
                                }
                                post.id = result.insertId;
                                insertedData.push(post.offer_id);

                                if(i== ad_offers.length - 1) {
                                    connection.query('SELECT ppc_offers.*, ppc_ad_offers.ad_id from ppc_offers inner join ppc_ad_offers on ppc_offers.id = ppc_ad_offers.offer_id WHERE ppc_ad_offers.offer_id IN (?)', [insertedData],
                                        function(err, rows, fields) {
                                            connection.release();
                                            if(err) {
                                                return reject(err);
                                            }
                                            resolve(rows);
                                        }
                                    );
                                }
                            }
                        );
                    });
                });


            }, function(error){
                reject(error);
            });
        });
    },
    saveAdvertiserOffer: function(advertiser_id, advertiser_offer) {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                connection.query('INSERT INTO ppc_offers SET ?', [advertiser_offer],
                    function (err, result) {
						connection.release();
                        if(err){
                            reject(err);
                        }
                        advertiser_offer.id = result.insertId;
                        resolve(advertiser_offer);
                    }
                );
                
            }, function(error){
                reject(error);
            });
        });
    },

    saveZiphubOffer : function(offer){
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                offer.is_approved = 0;
                offer.offer_type = 'ziphub';

                connection.query('INSERT INTO ppc_offers SET ?', [offer],
                    function (err, result) {
                        connection.release();

                        if(err){
                            return reject(err);
                        }

                        resolve(result);
                    }
                );
                
            }, function(error){
                reject(error);
            });
        });
    },

    saveAdvertiserFile: function(advertiser_id, advertiser_file) {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                connection.query('INSERT INTO ppc_files SET ?', [advertiser_file],
                    function (err, result) {
						connection.release();
                        if(err){
                            reject(err);
                        }
                        advertiser_file.id = result.insertId;
                        resolve(advertiser_file);
                    }
                );
                
            }, function(error){
                reject(error);
            });
        });
    },
    
    saveAdFiles: function(ad_id,ad_files) {
        var insertedData = [];
        return new Promise(function(resolve, reject) {
            if(! (ad_files instanceof Array) || ad_files.length <= 0 || isNaN(ad_id))
                return reject(new Error('Invalid ad id or empty ad offer array.'));

            DbHelper.getConnection().then(function(connection){
                ad_files.forEach(function(objFile, i){
                    var post = {ad_id: objFile.ad_id, file_id: objFile.file_id };

                    connection.query('INSERT INTO ppc_ad_files SET ?', [post],
                        function (err, result) {
                            if(err){
                                connection.release();
                                reject(err);
                            }
                            post.id = result.insertId;
                            insertedData.push(post);
                            if(i== ad_files.length - 1) {
                                connection.release();
                                resolve(insertedData);
                            }
                        }
                    );
                });
                
            }, function(error){
                reject(error);
            });
        });
    },

    //Save Category
    saveCategory: function(category) {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                if(category.id == 0 ) {
                    connection.query('INSERT INTO ppc_keyword_categories SET ?', [category],
                        function (err, rows, fields) {
                            connection.release();
                            if(err){
                                return reject(err);
                            }
                            resolve(rows);
                        }
                    );
                } else {
                    connection.query('Update ppc_keyword_categories SET ? WHERE id = ?', [category, category.id],
                        function (err, rows, fields) {
                            connection.release();
                            if(err){
                                return reject(err);
                            }
                            resolve(rows);
                        }
                    );
                }

            }, function(error){
                reject(error);
            });
        });
    },
    //Save Keyword
    saveKeyword: function(keyword) {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                if(keyword.id == 0 ) {
                    connection.query('INSERT INTO ppc_keywords SET ?', [keyword],
                        function (err, rows, fields) {
                            connection.release();
                            if(err){
                                reject(err);
                            }
                            resolve(rows);
                        }
                    );
                } else {
                    connection.query('Update ppc_keywords SET ? WHERE id = ?', [keyword, keyword.id],
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
                reject(error);
            });
        });
    },

    saveCategoryKeywords: function(categoryKeywords) {
        var insertedData = [];
        return new Promise(function(resolve, reject){
            if(! (categoryKeywords instanceof Array)  || categoryKeywords.length <= 0)
                return reject(new Error('categoryKeywords not a valid array.'));

            DbHelper.getConnection().then(function(connection){
                categoryKeywords.forEach(function(objCategoryKeyword, i){
                    var post = {category_id: objCategoryKeyword.category_id, keyword_id: objCategoryKeyword.keyword_id};
                    connection.query('INSERT INTO ppc_keywords_categories SET ?', [post],
                        function (err, result) {
                            if(err){
								connection.release();
                                return reject(err);
                            }
                            post.id = result.insertId;
                            insertedData.push(post);
                            if(i== categoryKeywords.length -1) {
								connection.release();
                                resolve(insertedData);
                            }
                        }
                    );
                });

                
            }, function(error){
                reject(error);
            });
        });

    },

    //Approve or Disapprove Ads
    manageAd: function(ads) {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){
                for(var i=0; i< ads.length; i++) {
                    (function(i, ads){
						connection.query('Update ppc_ads SET ? WHERE id = ?', [ads[i], ads[i].id],
							function (err, rows, fields) {
								if(err){
									connection.release();
									return reject(err);
								}
								
								if(i === ads.length - 1){
									connection.release();
									resolve({Success: true, message:'ADs Management Completed Successfully'});
								}
								
							}
						);
					})(i, ads);
                }
            }, function(error){
                reject(error);
            });
        });
    },

    deleteAd: function(adId){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(function(connection){
                connection.query('UPDATE ppc_ads SET is_deleted = 1 where id = ?', [adId],
                    function (err, rows, fields) {
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

    deleteAdOffer: function(offerId){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(function(connection){
                connection.query('DELETE FROM ppc_ad_offers WHERE id = ?', [offerId],
                    function (err, rows, fields) {
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
