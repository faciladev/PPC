var express = require('express');
var mime  = require('mime');
var config  = require('config');

var router = express.Router();

var dealModel = require('../models/dealModel');
var Util = require('../lib/util');
var UploadHelper = require('../lib/UploadHelper');

//Create Daily Deal
router.post('/', function(req, res, next){
	
	var deal = req.body.daily_deal;
	var dealMicrosite = req.body.daily_deal_microsite;
	dealModel.saveDeal(deal, dealMicrosite).then(function(response){
		res.json(response);
	}, function(error){
		next(error);
	});
});


//Get all daily deals
router.get('/', function(req, res, next){

	dealModel.getAllDeals(req.query.page).then(
		function(deals){
			res.json(deals);
		}, 
		function(error){
			next(error);
		}
	);
});

//Get all daily deals for one advertiser
router.get('/advertisers/:advertiserId', function(req, res, next){
	var advertiserId = req.params.advertiserId;
	dealModel.getAllDealsByAdvertiser(advertiserId, req.query.page).then(
		function(deals){
			res.json(deals);
		}, 
		function(error){
			next(error);
		}
	);
});


//Get all daily deal categories
router.get('/categories', function(req, res, next){
	dealModel.getDealCategories().then(
		function(categories){
			res.json(categories);
		}, 
		function(error){
			next(error);
		}
	);
});

//Upload images of deals, microsites, and coupons.
router.post('/upload', function(req, res, next){
	var uploadType = req.query.type;

	if(Object.keys(req.files).length === 0)
		return next(new Error('No file was uploaded.'));

	if(!uploadType)
		return next(new Error('Upload type not set.'));

	var subDir;

	switch(uploadType){
		case 'deal':
			subDir = uploadType;
			break;
		case 'deal_microsite':
			subDir = uploadType;
			break;
		case 'coupon':
			subDir = uploadType;
			break;
		default:
			return next(new Error('Invalid upload type.'));
	}


	UploadHelper.uploadFiles(req.files, subDir).then(function(response){
		var webpath = config.get('project_url') + "/" + subDir + "/" + response[0];
		var banner_code = "<a rel='nofollow' alt='Target' title='Target'>"+
            "<img border='0' src='"+ config.get('project_url') +
            "/" + subDir + "/" + response[0] + "' /></a>";

        res.json({banner_code: banner_code, banner_image_link: webpath});
		// res.json(response);
		
	}, function(error){
		console.log(error);
		res.json(error);
	});
});

//Approves a daily deal
router.put('/:dealId/approve', function(req, res, next){
	dealModel.updateDeal(req.params.dealId, {is_approved: 1}).then(
		function(result){
			res.json(result);
		}, 
		function(error){
			console.log(error);
			next(error);
		}
	);
});

//Get one daily deal
router.get('/:dealId', function(req, res, next){
	var dealId = req.params.dealId;
	dealModel.getDealById(dealId).then(
		function(deal){
			res.json(deal);
		}, 
		function(error){
			next(error);
		}
	);
});





module.exports = router;