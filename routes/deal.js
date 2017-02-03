var express = require('express');
var mime  = require('mime');
var config  = require('config');

var router = express.Router();

var dealModel = require('../models/dealModel');
var Util = require('../lib/util');
var UploadHelper = require('../lib/UploadHelper');

//Create Daily Deal
router.post('/', function(req, res, next){
	req.checkBody([
		'name', 
		'business_name', 
		'address_1', 
		'address_2', 
		'state', 
		'city', 
		'zipcode', 
		'phone_number', 
		'start_hour', 
		'end_hour',
		'coupon_name',
		'coupon_image',
		'advertiser_id',
		'location',
		'coupon_generated_code',
		'budget_limit',
		'budget_period',
		'suggested_category_id'
		], 
		'not empty').notEmpty();

	req.checkBody(
		[
		'download_price', 
		'discount_price', 
		'regular_price', 
		'advertiser_id'
		]
	).notEmpty().isInt();

	req.checkBody(['start_day', 'end_day'], 'not date').notEmpty().isDate();
	req.getValidationResult().then(function(result) {
		if(! result.isEmpty()){
			var deal = req.body.deal;//deal fields
			var dealMicrosite = req.body.dealMicrosite;//microsite fields
			dealModel.saveDeal(deal, dealMicrosite).then(function(response){
				res.json(response);
			}, function(error){
				next(error);
			});
		}
	});

});

//Get all daily deals
router.get('/', function(req, res, next){

	dealModel.getAllDeals().then(
		function(deals){
			res.json(deals);
		}, 
		function(error){
			next(error);
		}
	);

});

//Get all daily deals
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
		case 'microsite':
			subDir = uploadType;
			break;
		case 'coupon':
			subDir = uploadType;
			break;
		default:
			return next(new Error('Invalid upload type.'));
	}


	UploadHelper.uploadFiles(req.files, subDir).then(function(response){
		res.json(response.length === 1 ? response[0] : response);
	}, function(error){
		console.log(error);
		res.json(error);
	});

});

module.exports = router;