var express = require('express');
var mime  = require('mime');
var config  = require('config');

var router = express.Router();

var dealModel = require('../models/dealModel');
var Util = require('../lib/util');
var UploadHelper = require('../lib/UploadHelper');
var ppcModel = require('../models/ppcModel');

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

router.delete('/:id', function(req, res, next){
    var dealId = req.params.id;
    dealModel.deleteDeal(dealId).then(
        function(response){
            res.json(response);
        }, 
        function(error){
            next(error);
        }
    );
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
		function(paginatedDeals){
			if(paginatedDeals.result.length === 0)
				return res.json(paginatedDeals);

			for(var i = 0; i<paginatedDeals.result.length; i++){
				(function(i){
					ppcModel.getNumDealDownloads(paginatedDeals.result[i].deal_id).then(
						function(response){
							paginatedDeals.result[i]['downloads'] = response.downloads;

							if(i=== paginatedDeals.result.length - 1)
								return res.json(paginatedDeals);
						}, 
						function(error){
							next(error);
						}
					);
				})(i)
			}
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
		var assetPath = subDir + "/" + response[0];
		var webpath = config.get('project_url') + "/" + assetPath;
		var banner_code = "<a rel='nofollow' alt='Target' title='Target'>"+
            "<img border='0' src='"+ config.get('project_url') +
            "/" + assetPath + "' /></a>";

        res.json({banner_code: banner_code, banner_image_link: webpath, banner_image_name: response[0]});
		
	}, function(error){
		res.json(error);
	});
});

router.put('/:dealId', function(req, res, next){
	var deal = req.body.daily_deal;
	var dealMicrosite = req.body.daily_deal_microsite;
	var dealId = req.params.dealId;

	dealModel.updateDeal(dealId, deal, dealMicrosite).then(
		function(result){
			res.json(result);
		}, 
		function(error){
			console.log(error);
			next(error);
		}
	);
});

//Approves a daily deal
router.put('/:dealId/approve', function(req, res, next){
	
	var deal = {
		download_price: req.body.download_price,
		approved_category_id: req.body.approved_category_id,
		is_approved: 1
	}

	dealModel.approveDeal(req.params.dealId, deal).then(
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