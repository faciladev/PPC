var express = require('express');

var router = express.Router();

var subPageModel = require('../models/subPageModel');
var usaStateModel = require('../models/usaStateModel');
var advertiserModel = require('../models/advertiserModel');
var ads = require('../models/ads');
var Util = require('../lib/util');

//router for all daily deal subpages
router.get('/subpages', function(req, res, next){
	subPageModel.getSubPages().then(
		function(subPages){
			res.json(subPages);
		}, 
		function(error){
			next(error);
		}
	);
});

//router for all ad subpages
router.get('/adSubpages', function(req, res, next) {
    subPageModel.getAdSubpages().then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});


router.get('/usastates', function(req, res, next){
	usaStateModel.getUsaStates().then(
		function(usaStates){
			res.json(usaStates);
		}, 
		function(error){
			next(error);
		}
	);
});
router.get('/categories', function(req, res, next) {
    ads.getCategories().then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});
router.get('/keywords', function(req, res, next) {
    ads.getKeywords().then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});


router.get('/advertisers', function(req, res, next){
	advertiserModel.getAdvertisers().then(
		function(advertisers){
			res.json(advertisers);
		}, 
		function(error){
			next(error);
		}
	);
});

router.post('/categories', function(req, res, next) {
    ads.saveCategory(req.body).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});
router.post('/keywords', function(req, res, next) {
    ads.saveKeyword(req.body).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});

router.post('/categoryKeywords', function(req, res, next) {
    ads.saveCategoryKeywords(req.body).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});

module.exports = router;