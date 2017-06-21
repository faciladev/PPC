var express = require('express');
var config = require('config');

var ads = require('../models/ads');
var authorize = require('./authorize');
var ppcModel = require('../models/ppcModel');
var UploadHelper = require('../lib/UploadHelper');
var Util = require('../lib/util');

var appError = require('../app_error');
var router = express.Router();

/**
 * @api {get} /ads Get All Sponsored Ads
 * @apiVersion 0.1.0
 * @apiName GetAllAds
 * @apiGroup Sponsored Ads
 * @apiSuccess {Object[]} result List of Sponsored Ads
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *     {
 *        "result": [
 *          {
 *            "id": 1,
 *            "advertiser_id": 192,
 *            "advertizer_business_name": "ABC",
 *            "budget_limit": 2000,
 *            "usa_state_name": "Nevada",
 *            "city": "Las Vegas",
 *            "zipcode": "1234",
 *            "ad_id": 144,
 *            "url": "www.facilo.com",
 *            "title": "Facilo's Ad",
 *            "address": "817 S Main St, Las Vegas, NV 89101",
 *            "lat": null,
 *            "lng": null,
 *            "phone_no": "251911448404",
 *            "ad_text": "Facilo's ad",
 *            "locations": [
 *                {
 *                    "id": 1,
 *                    "ad_id": 1,
 *                    "state_id": 1,
 *                    "city": "Las Vegas",
 *                    "zip_code": 1234
 *                },
 *            ],
 *            "keywords": [
 *                {
 *                    "id": 1,
 *                    "ad_id": 1,
 *                    "keyword_id": 1,
 *                    "category_id": 1,
 *                    "keyword": "test",
 *                    "price": 2,
 *                    "created_by": 1
 *                },
 *            ],
 *            "subpages": [
 *                {
 *                    "id": 1,
 *                    "ad_id": 1,
 *                    "sub_page_id": 1,
 *                },
 *            ]
 *          }
 *        ],
 *        "page": 1,
 *        "numRowsPerPage": 10,
 *        "totalRows": 1,
 *        "totalPages": 1
 *      }
 */
router.get('/', function(req, res, next) {
    var search = req.query.search;
    var type = req.query.type;
    ads.getAll(req.query.page, search, type, req.query.numRowsPerPage).then(function(response){
        res.json(response);
    }, function(error){
        next(error);
    });
});

/**
 * @api {get} /ads/advertiser/:advertiserId Get Sponsor Ads By Advertiser Id
 * @apiVersion 0.1.0
 * @apiName GetAdsByAdvertiser
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} advertiserId  Advertiser Id
 * @apiSuccess {Object[]} result List of Advertiser Sponsored Ads.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *     {
 *        "result": [
 *          {
 *            "id": 1,
 *            "advertiser_id": 192,
 *            "advertizer_business_name": "ABC",
 *            "budget_limit": 2000,
 *            "usa_state_name": "Nevada",
 *            "city": "Las Vegas",
 *            "zipcode": "1234",
 *            "ad_id": 144,
 *            "url": "www.facilo.com",
 *            "title": "Facilo's Ad",
 *            "address": "817 S Main St, Las Vegas, NV 89101",
 *            "lat": null,
 *            "lng": null,
 *            "phone_no": "251911448404",
 *            "ad_text": "Facilo's ad",
 *            "locations": [
 *                {
 *                    "id": 1,
 *                    "ad_id": 1,
 *                    "state_id": 1,
 *                    "city": "Las Vegas",
 *                    "zip_code": 1234
 *                },
 *            ],
 *            "keywords": [
 *                {
 *                    "id": 1,
 *                    "ad_id": 1,
 *                    "keyword_id": 1,
 *                    "category_id": 1,
 *                    "keyword": "test",
 *                    "price": 2,
 *                    "created_by": 1
 *                },
 *            ],
 *            "subpages": [
 *                {
 *                    "id": 1,
 *                    "ad_id": 1,
 *                    "sub_page_id": 1,
 *                },
 *            ]
 *          }
 *        ],
 *        "page": 1,
 *        "numRowsPerPage": 10,
 *        "totalRows": 1,
 *        "totalPages": 1
 *      }
 */
router.get('/advertiser/:advertiserId', function(req, res, next) {
    var search = req.query.search;
    var type = req.query.type;
    var advertiserId = req.params.advertiserId;
    var page = req.query.page;
    ads.getAllByAdvertiser(page, advertiserId, search, type, req.query.numRowsPerPage).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});

/**
 * @api {get} /ads/:adId Get Sponsor Ad By Id
 * @apiVersion 0.1.0
 * @apiName GetAdById
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} adId  Sponsored Ad Id
 * @apiSuccess {Object} result Ad information
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "id": 1,
 *   "advertiser_id": 192,
 *   "advertizer_business_name": "ABC",
 *   "budget_limit": 2000,
 *   "usa_state_name": "Nevada",
 *   "city": "Las Vegas",
 *   "zipcode": "1234",
 *   "ad_id": 144,
 *   "url": "www.facilo.com",
 *    "title": "Facilo's Ad",
 *    "address": "817 S Main St, Las Vegas, NV 89101",
 *    "lat": null,
 *    "lng": null,
 *    "phone_no": "251911448404",
 *    "ad_text": "Facilo's ad",
 *    "locations": [
 *       {
 *           "id": 1,
 *           "ad_id": 1,
 *           "state_id": 1,
 *           "city": "Las Vegas",
 *           "zip_code": 1234
 *       },
 *     ],
 *     "keywords": [
 *         {
 *             "id": 1,
 *             "ad_id": 1,
 *             "keyword_id": 1,
 *             "category_id": 1,
 *             "keyword": "test",
 *             "price": 2,
 *             "created_by": 1
 *         },
 *     ],
 *     "subpages": [
 *         {
 *             "id": 1,
 *             "ad_id": 1,
 *             "sub_page_id": 1,
 *         },
 *     ]
 * }
 */
router.get('/:id', function(req, res, next) {
    ads.get(req.params.id).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});

/**
 * @api {get} /ads/:adId/locations Get Sponsor Ad Locaction
 * @apiVersion 0.1.0
 * @apiName GetAdLocation
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} adId Sponsored Ad Id
 * @apiSuccess {Object[]} result List of Locations
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "id": 156,
 *     "ad_id": 144,
 *     "state_id": 29,
 *     "city": "los angeles",
 *     "zip_code": "9826"
 *   },
 * ]
 */
router.get('/:id/locations', function(req, res, next) {
    ads.getAdLocations(req.params.id).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});

/**
 * @api {get} /ads/:adId/microsite Get Sponsor Ad Microsite
 * @apiVersion 0.1.0
 * @apiName GetAdMicrosite
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} adId Sponsored Ad Id
 * @apiSuccess {Object[]} result Microsite information
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "id": 97,
 *     "ad_id": 144,
 *     "name": "Facilo's Microsite",
 *     "business_name": "Facilo",
 *     "image": "path/to/xyz.jpg",
 *     "address_1": "817 S Main St, Las Vegas, NV 89101",
 *     "address_2": null,
 *     "state": "29",
 *     "city": "Las Vegas",
 *     "zipcode": "1234",
 *     "phone_number": null,
 *     "start_day": "Tue",
 *     "end_day": "Thur",
 *     "start_hour": "3am",
 *     "end_hour": "2:30am",
 *     "weekend_start_day": "Not Available",
 *     "weekend_end_day": "Not Available",
 *     "weekend_start_hour": "Not Available",
 *     "weekend_end_hour": "undefinedam",
 *     "date_created": "2017-03-09T15:25:36.000Z",
 *     "business_type": "business_type.name ",
 *     "business_info": null
 *   }
 * ]
 */
router.get('/:id/microsite', function(req, res, next) {
    ads.getAdMicrosite(req.params.id).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});

/**
 * @api {get} /ads/:adId/keywords Get Sponsor Ad Keywords
 * @apiVersion 0.1.0
 * @apiName GetAdKeywords
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} adId Sponsored Ad Id
 * @apiSuccess {Object[]} result List of keywords
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "id": 191,
 *     "ad_id": 144,
 *     "keyword_id": 2862,
 *     "category_id": 8,
 *     "keyword": "Elegant",
 *     "price": 1,
 *     "created_by": 0
 *   },
 * ]
 */
router.get('/:id/keywords', function(req, res, next) {
    ads.getAdKeywords(req.params.id).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});

/**
 * @api {get} /ads/:adId/subpages Get Sponsor Ad Subpages
 * @apiVersion 0.1.0
 * @apiName GetAdSubPages
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} adId Sponsored Ad Id
 * @apiSuccess {Object[]} result List of sub pages
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "id": 191,
 *     "ad_id": 144,
 *     "subpage_id": 2862
 *   },
 * ]
 */
router.get('/:id/subpages', function(req, res, next) {
    ads.getAdSubpages(req.params.id).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});

/**
 * @api {get} /ads/:adId/offers Get Sponsor Ad Offers
 * @apiVersion 0.1.0
 * @apiName GetAdSubOffers
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} adId Sponsored Ad Id
 * @apiSuccess {Object[]} result List of Offers
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "id": 122,
 *     "advertiser_id": 232,
 *     "name": null,
 *     "offer_type": "ziphub",
 *     "image": "1489073160489294278.jpeg",
 *     "url": "www.fasil.com",
 *     "code": "<embeddable code>",
 *     "deal_description": "description",
 *     "regular_price": 23,
 *     "discount": 2,
 *     "category_id": 1,
 *     "is_approved": 0,
 *     "start_date": "2017-01-12",
 *     "end_date": "2017-01-12",
 *     "ad_id": 144
 *   }
 * ]
 */
router.get('/:id/offers', function(req, res, next) {
    ads.getAdOffers(req.params.id).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});

/**
 * @api {get} /ads/:adId/adFiles Get Sponsor Ad Files
 * @apiVersion 0.1.0
 * @apiName GetAdFiles
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} adId Sponsored Ad Id
 * @apiSuccess {Object[]} result List of Files
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "id": 1133,
 *     "advertiser_id": 1206,
 *     "type": "image",
 *     "file_name": "1498004760115584629.png",
 *     "ad_id": 756
 *   }
 * ]
 */
router.get('/:id/adFiles', function(req, res, next) {
    ads.getAdFiles(req.params.id).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});

/**
 * @api {get} /ads/keywords/:categoryId Get Keywords By Category
 * @apiVersion 0.1.0
 * @apiName GetKeywordsByCategory
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} categoryId Category Id
 * @apiSuccess {Object[]} result List of keywords
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "id": 1133,
 *     "category_id": 1206,
 *     "keyword": "test",
 *     "price": 1,
 *     "created_by": 2
 *   },
 * ]
 */
router.get('/keywords/:categoryId', function(req, res, next) {
    ads.getCategoryKeywords(req.params.categoryId).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});

/**
 * @api {get} /ads/advertiserOffers/:advertiserId Get Advertiser Offers
 * @apiVersion 0.1.0
 * @apiName GetAdvertiserOffers
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} advertiserid Advertiser Id
 * @apiSuccess {Object[]} result List of Advertiser Offers
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "id": 93,
 *     "advertiser_id": 232,
 *     "name": "1 Hacker Way, Menlo Park, 94025",
 *     "offer_type": "in store",
 *     "image": "148890447561269538.jpeg",
 *     "url": "http://www.google.com",
 *     "code": "izzr9t03",
 *     "deal_description": "1 Hacker Way, Menlo Park, 94025",
 *     "regular_price": "2222",
 *     "discount": "10",
 *     "category_id": 3,
 *     "is_approved": 1,
 *     "start_date": "2017-01-09",
 *     "end_date": "2017-01-30"
 *   },
 * ]
 */
router.get('/advertiserOffers/:advertiserId', function(req, res, next) {
    ads.getAdvertiserOffers(req.params.advertiserId).then(function(response){
        res.json(response);
    }, function(error) {
        error.message = 'Error';
        next(error);
    });
});


/**
 * @api {post} /ads/ Save Sponsored Ad (Protected)
 * @apiVersion 0.1.0
 * @apiName SaveAd
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Object} ad Sponsored Ad Object
 * 
 */
router.post('/', authorize, function(req, res, next) {
    ads.saveAd(req.body).then(function(response) {
            res.json(response);
        }, function(error) {
            error.message = 'Error';
            next(error);
        }
    );
});

/**
 * @api {put} /ads/:id Update Sponsored Ad (Protected)
 * @apiVersion 0.1.0
 * @apiName UpdateAd
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Object} ad Sponsored Ad Object
 * @apiParam {Number} id Sponsored Ad Id
 * 
 */
router.put('/:id', authorize, function(req, res, next){
    var adId = req.params.id;
    var newAdData = req.body;
    ads.updateAd(newAdData, adId).then(
        function(response){
            res.json(response);
        }, 
        function(error){
            next(error);
        }
    );
});

/**
 * @api {post} /ads/:id/microsite Save Ad Microsite (Protected)
 * @apiVersion 0.1.0
 * @apiName SaveAdMicrosite
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Object} microsite Microsite Object
 * @apiParam {Number} id Sponsored Ad Id
 * 
 */
router.post('/:id/microsite', authorize, function(req, res, next) {
    ads.saveAdMicrosite(req.params.id, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        next(error);
    });

});

/**
 * @api {post} /ads/:id/keywords Save Ad Keywords (Protected)
 * @apiVersion 0.1.0
 * @apiName SaveAdKeywords
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Object} object Ad Keyword Object
 * @apiParam {Number} id Sponsored Ad Id
 * 
 */
router.post('/:id/keywords', authorize, function(req, res, next) {
    ads.saveAdKeywords(req.params.id, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        error.message = 'Error';
        next(error);
    });
});

/**
 * @api {post} /ads/:id/subpages Save Ad Sub Pages (Protected)
 * @apiVersion 0.1.0
 * @apiName SaveAdSubpages
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Object} object Ad Subpage Object
 * @apiParam {Number} id Sponsored Ad Id
 * 
 */
router.post('/:id/subpages', authorize, function(req, res, next) {
    ads.saveAdSubPages(req.params.id, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        error.message = 'Error';
        next(error);
    });
});

/**
 * @api {post} /ads/:id/locations Save Ad Locations (Protected)
 * @apiVersion 0.1.0
 * @apiName SaveAdLocations
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Object} object Ad Location Object
 * @apiParam {Number} id Sponsored Ad Id
 * 
 */
router.post('/:id/locations', authorize, function(req, res, next) {
    ads.saveAdLocations(req.params.id, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        error.message = 'Error';
        next(error);
    });
});

/**
 * @api {post} /ads/:id/offers Save Ad Offers (Protected)
 * @apiVersion 0.1.0
 * @apiName SaveAdOffers
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Object} object Ad Offer Object
 * @apiParam {Number} id Sponsored Ad Id
 * 
 */
router.post('/:id/offers', authorize, function(req, res, next) {
    var ad_id = parseInt(req.params.id);
    ads.saveAdOffers(ad_id, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        error.message = 'Error';
        next(error);
    });
});

/**
 * @api {post} /ads/:id/offers Save Advertiser Offers (Protected)
 * @apiVersion 0.1.0
 * @apiName SaveAdvertiserOffers
 * @apiGroup Sponsored Ads
 *
 * @apiParam {File} file Adveriser Offer Image
 * @apiParam {Number} advertiserId Advertiser Id
 * @apiParam {Object} object Advertiser Offer Object
 * 
 */
router.post('/advertiserOffers/:advertiserId', authorize, function(req, res, next) {
    if(!req.files){
        res.send('No files were uploaded');
        return;
    }

    UploadHelper.uploadFiles(req.files, "offer").then(function(response){
        req.body.image = response.length === 1 ? response[0] : response;
        ads.saveAdvertiserOffer(req.params.advertiserId, req.body).then(function(response){
            res.json(response);
        }, function(error) {
            error.message = 'Error';
            next(error);
        });
    }, function(error){
        res.json(error);
    });
});

/**
 * @api {post} /ads/ziphuboffers Save Ziphub Offers (Protected)
 * @apiVersion 0.1.0
 * @apiName SaveZiphubOffers
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Object} object Offer Object
 * 
 */
router.post('/ziphuboffers', authorize, function(req, res, next) {
    var offer = req.body;
    ads.saveZiphubOffer(offer).then(function(response){
        res.json(response);
    }, function(error) {
        next(error);
    });
});

/**
 * @api {post} /ads/:id/offers Save Advertiser Offers (Protected)
 * @apiVersion 0.1.0
 * @apiName SaveAdvertiserOffers
 * @apiGroup Sponsored Ads
 *
 * @apiParam {File} file Adveriser Offer Image
 * @apiParam {Number} advertiserId Advertiser Id
 * @apiParam {Object} object Advertiser Offer Object
 * 
 */
router.post('/keywords/:categoryId', authorize, function(req, res, next) {
    ads.saveKeywords(req.params.categoryId, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        error.message = 'Error';
        next(error);
    });
});

/**
 * @api {post} /ads/advertiserFiles/:advertiserId Save Advertiser File (Protected)
 * @apiVersion 0.1.0
 * @apiName SaveAdvertiserFile
 * @apiGroup Sponsored Ads
 *
 * @apiParam {File} file Adveriser File
 * @apiParam {Number} advertiserId Advertiser Id
 * @apiParam {Object} object Advertiser File Object
 * 
 */
router.post('/advertiserFiles/:advertiserId', authorize, function(req, res, next) {
    if(!req.files){
        res.send('No files were uploaded');
        return;
    }

    UploadHelper.uploadFiles(req.files, "ad_files").then(function(response){
        req.body.file_name = response.length === 1 ? response[0] : response;
        ads.saveAdvertiserFile(req.params.advertiserId, req.body).then(function(response){
            res.json(response);
        }, function(error) {
            error.message = 'Error';
            next(error);
        });
    }, function(error){
        res.json(error);
    });
});

/**
 * @api {post} /ads/:adId/adFiles Save Ad Files (Protected)
 * @apiVersion 0.1.0
 * @apiName SaveAdFiles
 * @apiGroup Sponsored Ads
 *
 * @apiParam {File} file Adveriser File
 * @apiParam {Number} adId Sponsored Ad Id
 * @apiParam {Object} object Ad File Object
 * 
 */
router.post('/:id/adFiles', authorize, function(req, res, next) {
    var ad_id = parseInt(req.params.id);
    ads.saveAdFiles(ad_id, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        next(error);
    });
});

/**
 * @api {post} /ads/manageAds Manage Ads (Protected)
 * @apiVersion 0.1.0
 * @apiName ManageAds
 * @apiGroup Sponsored Ads
 * 
 * @apiParam {Object} object Ad Object
 * 
 */
router.post('/manageAds', authorize, function(req, res, next) {
    ads.manageAd(req.body).then(function(response) {
            res.json(response);
        }, function(error) {
            error.message = 'Error';
            next(error);
        }
    );
});

/**
 * @api {post} /ads/weboffers Upload Web Offers (Protected)
 * @apiVersion 0.1.0
 * @apiName UploadWebOffers
 * @apiGroup Sponsored Ads
 * 
 * @apiParam {File} file Web Offer Image
 * @apiParam {String} url Web Offer Url
 * 
 */
router.post('/weboffers', authorize, function(req, res, next){
    var url = req.body.url;

    if(typeof req.files.offerBanner === 'undefined' || req.files.offerBanner === null)
        return next(new appError('No file was uploaded.'));

    if(typeof url === 'undefined' || url === null)
        return next(new appError('No url provided.'));

    var subDir = 'offer';

    UploadHelper.uploadFile(req.files.offerBanner, subDir).then(function(response){
        var webpath = config.get('project_url') + "/" + subDir + "/" + response;
        
        var banner_code = "<a href='" + url + "' rel='nofollow' target='_blank' alt='Target' title='Target'>"+
            "<img border='0' src='"+ webpath + "' /></a>";

        res.json({banner_code: banner_code, banner_image_link: url, banner_image_src: webpath, banner_image_name: response});
        
    }, function(error){
        next(error);
    });
});


/**
 * @api {delete} /ads/:adId Delete Sponsored Ads (Protected)
 * @apiVersion 0.1.0
 * @apiName DeleteAds
 * @apiGroup Sponsored Ads
 * 
 * @apiParam {Number} adId Sponsored Ad Id
 * 
 */
router.delete('/:id', authorize, function(req, res, next){
    var adId = req.params.id;
    ads.deleteAd(adId).then(
        function(response){
            res.json(response);
        },
        function(error){
            next(error);
        }
    );
});

/**
 * @api {delete} /ads/offers/:offerId Delete Ads Offers (Protected)
 * @apiVersion 0.1.0
 * @apiName DeleteAdOfferss
 * @apiGroup Sponsored Ads
 * 
 * @apiParam {Number} offerId Ad Offer Id
 * 
 */
router.delete('/offers/:offerId', authorize, function(req, res, next){
    var offerId = req.params.offerId;
    ads.deleteAdOffer(offerId).then(
        function(response){
            res.json(response);
        },
        function(error){
            next(error);
        }
    );
});

/**
 * @api {put} /ads/:adId/pause Pause A Sponsored Ad. (Protected)
 * @apiVersion 0.1.0
 * @apiName pauseASponsoredAd
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} adId Sponsored Ad Id
 *
 * @apiSuccess {Boolean} status True if approve operation succeeds else False.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "status": true
 *     }
 *       
 */
router.put('/:adId/pause', authorize, function(req, res, next){
    
    var ad = {
        paused: 1
    }

    ads.partialUpdateAd(req.params.adId, ad).then(
        function(result){
            res.json(result);
        }, 
        function(error){
            next(error);
        }
    );
});

/**
 * @api {put} /ads/:adId/unpause Unpause A Sponsored Ad. (Protected)
 * @apiVersion 0.1.0
 * @apiName UnpauseASponsoredAd
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} adId Sponsored Ad Id
 *
 * @apiSuccess {Boolean} status True if approve operation succeeds else False.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "status": true
 *     }
 *       
 */
router.put('/:adId/unpause', authorize, function(req, res, next){
    
    var ad = {
        paused: 0
    }

    ads.partialUpdateAd(req.params.adId, ad).then(
        function(affectedRows){
            res.json(
                (parseInt(affectedRows)) ? { status: true } : { status: false }
            );
        }, 
        function(error){
            next(error);
        }
    );
});

/**
 * @api {get} /ads/:subpageId/featured Get Featured Sponsored Ads By Subpage Id
 * @apiVersion 0.1.0
 * @apiName GetFeaturedponsoredAdsBySubpageId
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} subpageId Subpage ID
 *
 * @apiSuccess {Object[]} featuredAds List of Featured Ads In A Category.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *        {
 *          "usa_state_code": "NV",
 *          "usa_state_name": "Nevada",
 *          "city": "Las vegas",
 *          "zipcode": "89146",
 *          "ad_id": 148,
 *          "url": "www.yyt.com",
 *          "title": "test",
 *          "address": "7865 w sahara",
 *          "lat": null,
 *          "lng": null,
 *          "phone_no": "7023062676",
 *          "sub_page_id": 1,
 *          "ad_text": "test",
 *          "redirectUrl": "http://54.67.28.43:8081/api/click/f_ads/148/1/http%3A%2F%2Fiziphub.com%2FCategories%2Flisting_microsite%2F148"
 *        },
 *        {
 *          "usa_state_code": "NV",
 *          "usa_state_name": "Nevada",
 *          "city": "las vegas",
 *          "zipcode": "89146",
 *          "ad_id": 155,
 *          "url": "http://www.actionprintingservice.com/",
 *          "title": "Sport Events",
 *          "address": "Bethole",
 *          "lat": "17.5603359",
 *          "lng": "79.99794109999999",
 *          "phone_no": "251911448404",
 *          "sub_page_id": 1,
 *          "ad_text": "Sport Events",
 *          "redirectUrl": "http://54.67.28.43:8081/api/click/f_ads/155/1/http%3A%2F%2Fiziphub.com%2FCategories%2Flisting_microsite%2F155"
 *        }
 *     ]
 *       
 */
router.get('/:subpage/featured', function(req, res, next){

    var subPage = parseInt(req.params.subpage);
    let location = req.query.location;
    // if(! location)
    // {
    //     const ip = Util.getClientIp(req);
    //     const ipAddress = Util.ipToLocation(ip);

    //     if(ipAddress && ipAddress.country === 'US'){
    //         location = ipAddress.zip;
    //     } else {
    //         return res.json({status: false, message: 'Location not in the USA'});
    //     }

        
    // }

    //Temporarily turn off location feature
    location = false;
    
    ads.getFeatured(subPage, location).then(
        function(featuredAds){
            if(! (featuredAds.length > 0))
                return res.json([]);
            Util.removeObjDupInArr(featuredAds, "ad_id").then(
                function(featuredAds){
                    for(var i=0; i<featuredAds.length;i++){
                        var redirectUrl = Util.sanitizeUrl(config.get('web_portal_url') + '/' + 
                                        'Categories/listing_microsite/' + featuredAds[i].ad_id);
                        featuredAds[i].redirectUrl = config.get('project_url') + 
                            '/api/click/f_ads/' + featuredAds[i].ad_id + '/' + subPage + '/' +
                            redirectUrl;
                    }

                    res.json(featuredAds);
                },
                function(error){
                    next(error);
                }
            );

                

        }, function(error){
            next(error);
        }
    );
});

/**
 * @api {put} /ads/:adId/featured Make A Sponsored Ad featured. (Protected)
 * @apiVersion 0.1.0
 * @apiName FeaturedponsoredAds
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} adId Sponsored Ad Id
 *
 * @apiSuccess {Boolean} status True if approve operation succeeds else False.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "status": true
 *     }
 *       
 */
router.put('/:adId/featured', authorize, function(req, res, next){
    
    var ad = {
        is_featured: 1
    }

    ads.partialUpdateAd(req.params.adId, ad).then(
        function(affectedRows){
            res.json(
                (parseInt(affectedRows)) ? { status: true } : { status: false }
            );
        }, 
        function(error){
            next(error);
        }
    );
});

/**
 * @api {put} /ads/:adId/notfeatured Make A Sponsored Ad not featured. (Protected)
 * @apiVersion 0.1.0
 * @apiName NotFeaturedponsoredAds
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} adId Sponsored Ad Id
 *
 * @apiSuccess {Boolean} status True if approve operation succeeds else False.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "status": true
 *     }
 *       
 */
router.put('/:adId/notfeatured', authorize, function(req, res, next){
    
    var ad = {
        is_featured: 0
    }

    ads.partialUpdateAd(req.params.adId, ad).then(
        function(affectedRows){

            res.json(
                (parseInt(affectedRows)) ? { status: true } : { status: false }
            );
        }, 
        function(error){
            next(error);
        }
    );
});

/**
 * @api {put} /ads/:adId/approve Approve Sponsored Ads (Protected)
 * @apiVersion 0.1.0
 * @apiName ApproveSponsoredAds
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} adId Sponsored Ad Id
 *
 * @apiSuccess {Boolean} status True if approve operation succeeds else False.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "status": true
 *     }
 *       
 */

router.put('/:adId/approve', authorize, function(req, res, next){
    
    var ad = {
        is_approved: 1
    }

    ads.partialUpdateAd(req.params.adId, ad).then(
        function(affectedRows){
            res.json(
                (parseInt(affectedRows)) ? { status: true } : { status: false }
            );
        }, 
        function(error){
            next(error);
        }
    );
});

/**
 * @api {put} /ads/:adId/disapprove Disapprove Sponsored Ads (Protected)
 * @apiVersion 0.1.0
 * @apiName DisapproveSponsoredAds
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} adId     Sponsored Ad Id
 *
 * @apiSuccess {Boolean} status True if approve operation succeeds else False.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "status": true
 *     }
 *       
 */
router.put('/:adId/disapprove', authorize, function(req, res, next){
    
    var ad = {
        is_approved: 0
    }

    ads.partialUpdateAd(req.params.adId, ad).then(
        function(affectedRows){
            res.json(
                (parseInt(affectedRows)) ? { status: true } : { status: false }
            );
        }, 
        function(error){
            next(error);
        }
    );
});

/**
 * @api {post} /ads/adoffers/:offerId/:userId Member Save Sponsored Ad Offers (Protected)
 * @apiVersion 0.1.0
 * @apiName MemberSaveSponsoredAdOffers
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} offerId  Offer Id.
 * @apiParam {Number} userId  User Id.
 */
router.post('/adoffers/:offerId/:userId', authorize, function(req, res, next){
    ppcModel.saveConsumerAdOffer(req.params.userId, req.params.offerId).then(
        (response)=>{
            return res.json({status: true, message: "ad offer saved."});
        }, 
        (error)=>{
            return next(error);
        }
    );
});

/**
 * @api {get} /ads/adoffers/:userId Member List Sponsored Ad Offers
 * @apiVersion 0.1.0
 * @apiName MemberListSponsoredAdOffers
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} userId  User Id.
 */
router.get('/adoffers/:userId', function(req, res, next){
    ppcModel.findConsumerAdOffer(req.params.userId, req.query.page).then(
        (response)=>{
            return res.json(response);
        }, 
        (error)=>{
            return next(error);
        }
    );
});

/**
 * @api {delete} /ads/adoffers/:userId/:consumerOfferId Delete saved consumer sponsored ad offer (Protected)
 * @apiVersion 0.1.0
 * @apiName DeleteSavedConsumerOffer
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} userId  User Id.
 * @apiParam {Number} consumerOfferId  Saved consumer offer id.
 */
router.delete('/adoffers/:userId/:consumerOfferId', authorize, function(req, res, next){
    ppcModel.deleteConsumerAdOffer(req.params.userId, req.params.consumerOfferId).then(
        (response)=>{
            return res.json({status: true, message: "Consumer offer deleted."});
        }, 
        (error)=>{
            return next(error);
        }
    );
});


module.exports = router;
