var express = require('express');
var config = require('config');

var ads = require('../models/ads');
var UploadHelper = require('../lib/UploadHelper');
var Util = require('../lib/util');

var router = express.Router();

router.get('/', function(req, res, next) {
    var search = req.query.search;
    var type = req.query.type;
    ads.getAll(req.query.page, search, type).then(function(response){
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
    ads.getAllByAdvertiser(page, advertiserId, search, type).then(function(response){
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
router.post('/', function(req, res, next) {
    ads.saveAd(req.body).then(function(response) {
            res.json(response);
        }, function(error) {
            error.message = 'Error';
            next(error);
        }
    );
});

router.put('/:id', function(req, res, next){
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

router.post('/:id/microsite', function(req, res, next) {
    ads.saveAdMicrosite(req.params.id, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        error.message = 'Error';
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
router.post('/:id/keywords', function(req, res, next) {
    ads.saveAdKeywords(req.params.id, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        error.message = 'Error';
        next(error);
    });
});
router.post('/:id/subpages', function(req, res, next) {
    ads.saveAdSubPages(req.params.id, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        error.message = 'Error';
        next(error);
    });
});
router.post('/:id/locations', function(req, res, next) {
    ads.saveAdLocations(req.params.id, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        error.message = 'Error';
        next(error);
    });
});

//Creates Ad offers
router.post('/:id/offers', function(req, res, next) {
    var ad_id = parseInt(req.params.id);
    ads.saveAdOffers(ad_id, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        error.message = 'Error';
        next(error);
    });
});

//Creates Advertiser offer
router.post('/advertiserOffers/:advertiserId', function(req, res, next) {
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

router.post('/ziphuboffers', function(req, res, next) {
    var offer = req.body;
    ads.saveZiphubOffer(offer).then(function(response){
        res.json(response);
    }, function(error) {
        next(error);
    });
});

//Save keyword and keyword category
router.post('/keywords/:categoryId', function(req, res, next) {
    ads.saveKeywords(req.params.categoryId, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        error.message = 'Error';
        next(error);
    });
});

//Creates Advertiser files
router.post('/advertiserFiles/:advertiserId', function(req, res, next) {
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
router.post('/:id/adFiles', function(req, res, next) {
    var ad_id = parseInt(req.params.id);
    ads.saveAdFiles(ad_id, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        next(error);
    });
});

//Approve Ads
router.post('/manageAds', function(req, res, next) {
    ads.manageAd(req.body).then(function(response) {
            res.json(response);
        }, function(error) {
            error.message = 'Error';
            next(error);
        }
    );
});

//Upload web offer image
router.post('/weboffers', function(req, res, next){
    var url = req.body.url;

    if(typeof req.files.offerBanner === 'undefined' || req.files.offerBanner === null)
        return next(new Error('No file was uploaded.'));

    if(typeof url === 'undefined' || url === null)
        return next(new Error('No url provided.'));

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
router.delete('/:id', function(req, res, next){
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

router.delete('/offers/:offerId', function(req, res, next){
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

//Pause sponsor ad
router.put('/:adId/pause', function(req, res, next){
    
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

//Unpause sponsor ad
router.put('/:adId/unpause', function(req, res, next){
    
    var ad = {
        paused: 0
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

//Get featured ads
router.get('/:subpage/featured', function(req, res, next){

    var subPage = parseInt(req.params.subpage);

    ads.getFeatured(subPage).then(
        function(featuredAds){
            if(! (featuredAds.length > 0))
                return res.json([]);

            for(var i=0; i<featuredAds.length;i++){
                var redirectUrl = Util.sanitizeUrl(config.get('web_portal_url') + '/' + 
                                'Categories/listing_microsite/' + featuredAds[i].ad_id);
                featuredAds[i].redirectUrl = config.get('project_url') + 
                    '/api/click/f_ads/' + featuredAds[i].ad_id + '/' + subPage + '/' +
                    redirectUrl;
            }

            res.json(featuredAds);

        }, function(error){
            next(error);
        }
    );
});

//Make sponsor ad featured
router.put('/:adId/featured', function(req, res, next){
    
    var ad = {
        is_featured: 1
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

//Remove sponsor ad from being featured
router.put('/:adId/notfeatured', function(req, res, next){
    
    var ad = {
        is_featured: 0
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

//Approve sponsor ad
router.put('/:adId/approve', function(req, res, next){
    
    var ad = {
        is_approved: 1
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

//Disapprove sponsor ad
router.put('/:adId/disapprove', function(req, res, next){
    
    var ad = {
        is_approved: 0
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

module.exports = router;
