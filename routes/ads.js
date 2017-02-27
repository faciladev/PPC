var express = require('express');
var config = require('config');

var router = express.Router();
var ads = require('../models/ads');
var UploadHelper = require('../lib/UploadHelper');

router.get('/', function(req, res, next) {
    ads.getAll(req.query.page).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});
//Gets all ads by advertiser
router.get('/advertiser/:advertiserId', function(req, res, next) {
    ads.getAllByAdvertiser(req.query.page, req.params.advertiserId).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});
router.get('/:id/', function(req, res, next) {
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
    ads.saveAdOffers(req.params.id, req.body).then(function(response){
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
    ads.saveAdFiles(req.params.id, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        error.message = 'Error';
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

        res.json({banner_code: banner_code, banner_image_link: url, banner_image_src: webpath});
        
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
module.exports = router;
