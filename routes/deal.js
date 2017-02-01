var express = require('express');
var router = express.Router();
var dealModel = require('../models/dealModel');
var Util = require('../lib/util');

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
		'start_day', 
		'end_day', 
		'start_hour', 
		'end_hour',
		'coupon_name',
		'location',
		'coupon_generated_code',
		'budget_limit',
		'budget_period',
		'regular_price',
		'discount_price',
		'download_price'
		], 
		'not empty').notEmpty();
	req.checkBody(['start_day', 'end_day'], 'not date').notEmpty().isDate();
	req.getValidationResult().then(function(result) {
		if(! result.isEmpty()){
			var deal = req.body;//deal fields
			var dealMicrosite = req.body;//microsite fields
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

module.exports = router;