var express = require('express');
var config = require('config');

var ads = require('../models/ads');
var authorize = require('./authorize');
var ppcModel = require('../models/ppcModel');
var UploadHelper = require('../lib/UploadHelper');
var Util = require('../lib/util');

var appError = require('../app_error');
var router = express.Router();

router.get('/', function(req, res, next) {
    var search = req.query.search;
    var type = req.query.type;
    ads.getAll(req.query.page, search, type, req.query.numRowsPerPage).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});
//Gets all ads by advertiser
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
router.get('/:id', function(req, res, next) {
    ads.get(req.params.id).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});
router.get('/:id/locations', function(req, res, next) {
    ads.getAdLocations(req.params.id).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});
router.get('/:id/microsite', function(req, res, next) {
    ads.getAdMicrosite(req.params.id).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});
router.get('/:id/keywords', function(req, res, next) {
    ads.getAdKeywords(req.params.id).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});

router.get('/:id/subpages', function(req, res, next) {
    ads.getAdSubpages(req.params.id).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});
router.get('/:id/offers', function(req, res, next) {
    ads.getAdOffers(req.params.id).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});
router.get('/:id/adFiles', function(req, res, next) {
    ads.getAdFiles(req.params.id).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});

//Gets category keywords
router.get('/keywords/:categoryId', function(req, res, next) {
    ads.getCategoryKeywords(req.params.categoryId).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});
router.get('/advertiserOffers/:advertiserId', function(req, res, next) {
    ads.getAdvertiserOffers(req.params.advertiserId).then(function(response){
        res.json(response);
    }, function(error) {
        error.message = 'Error';
        next(error);
    });
});


/**
 * POST Request section
 */
//Ads POST requests
router.post('/', authorize, function(req, res, next) {
    ads.saveAd(req.body).then(function(response) {
            res.json(response);
        }, function(error) {
            error.message = 'Error';
            next(error);
        }
    );
});

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

router.post('/:id/microsite', authorize, function(req, res, next) {
    ads.saveAdMicrosite(req.params.id, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        next(error);
    });

//    if(!req.files){
//        res.send('No files were uploaded');
//        return;
//    }
//
//    UploadHelper.uploadFiles(req.files, "microsite").then(function(response){
//        req.body.image = response.length === 1 ? response[0] : response;
//
//    }, function(error){
//        res.json(error);
//    });
});
router.post('/:id/keywords', authorize, function(req, res, next) {
    ads.saveAdKeywords(req.params.id, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        error.message = 'Error';
        next(error);
    });
});
router.post('/:id/subpages', authorize, function(req, res, next) {
    ads.saveAdSubPages(req.params.id, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        error.message = 'Error';
        next(error);
    });
});
router.post('/:id/locations', authorize, function(req, res, next) {
    ads.saveAdLocations(req.params.id, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        error.message = 'Error';
        next(error);
    });
});

//Creates Ad offers
router.post('/:id/offers', authorize, function(req, res, next) {
    var ad_id = parseInt(req.params.id);
    ads.saveAdOffers(ad_id, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        error.message = 'Error';
        next(error);
    });
});

//Creates Advertiser offer
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

router.post('/ziphuboffers', authorize, function(req, res, next) {
    var offer = req.body;
    ads.saveZiphubOffer(offer).then(function(response){
        res.json(response);
    }, function(error) {
        next(error);
    });
});

//Save keyword and keyword category
router.post('/keywords/:categoryId', authorize, function(req, res, next) {
    ads.saveKeywords(req.params.categoryId, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        error.message = 'Error';
        next(error);
    });
});

//Creates Advertiser files
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

//Upload ad files
router.post('/:id/adFiles', authorize, function(req, res, next) {
    var ad_id = parseInt(req.params.id);
    ads.saveAdFiles(ad_id, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        next(error);
    });
});

//Approve Ads
router.post('/manageAds', authorize, function(req, res, next) {
    ads.manageAd(req.body).then(function(response) {
            res.json(response);
        }, function(error) {
            error.message = 'Error';
            next(error);
        }
    );
});

//Upload web offer image
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
 * DELETE Request section
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
 * @api {put} /ads/:adId/pause Pause A Sponsored Ad.
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
 * @api {put} /ads/:adId/unpause Unpause A Sponsored Ad.
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
    if(! location)
    {
        const ip = Util.getClientIp(req);
        const ipAddress = Util.ipToLocation(ip);
        if(ipAddress.country === 'US'){
            location = ipAddress.zip;
        } else {
            return res.json({status: false, message: 'Location not in the USA'});
        }

        
    }

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
 * @api {put} /ads/:adId/featured Make A Sponsored Ad featured.
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
 * @api {put} /ads/:adId/notfeatured Make A Sponsored Ad not featured.
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
 * @api {put} /ads/:adId/approve Approve Sponsored Ads
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
 * @api {put} /ads/:adId/disapprove Disapprove Sponsored Ads
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
 * @api {post} /ads/adoffers/:offerId/:userId Member Save Sponsored Ad Offers
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
 * @api {delete} /ads/adoffers/:userId/:consumerOfferId Delete saved consumer sponsored ad offer
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
