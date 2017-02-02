var express = require('express');
var mime  = require('mime');
var config  = require('config');

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

router.post('/upload', function(req, res, next){
	var uploadFile;

	if(!req.files)
		next(new Error('No file was uploaded.'));

	var uploadType = req.query.type;
	if(!uploadType)
		next(new Error('Upload type not set.'));

	var uploadDir = __dirname + '/../PPC_ASSETS';
	var project_url = config.get('project_url');

	switch(uploadType){
		case 'deal':
			var newFile = req.files.couponImage;
			var newFileName = Date.now() + '.' + mime.extension(req.files.couponImage.mimetype);
			var newFileWebUrl = project_url + '/deals/' + newFileName;

			var newFileSavedLocation = uploadDir + '/deals/' + newFileName
			newFile.mv(uploadPath + newFileName, function(err) {
			    if (err) {
			      next(err);
			    }
			    else {
			    	var banner_code = "<a href='#' rel='nofollow' alt='Target' title='Target'>"+
                    "<img border='0' src='"+ newFileWebUrl +"' /></a>";


                	res.json({banner_code: banner_code, banner_image_link: newFileWebUrl});
			    }
		  	}
		  	);
			break;
		case 'microsite':
			uploadDir = 'dealmicrosites';
			break;
		case 'coupon':
			uploadDir = 'dealcoupons';
			break;
		default:
			next(new Error('Invalid upload type.'));
			break;
	}



});

module.exports = router;