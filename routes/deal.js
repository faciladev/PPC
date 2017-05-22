var express = require('express');
var mime  = require('mime');
var config  = require('config');

var router = express.Router();

var dealModel = require('../models/dealModel');
var Util = require('../lib/util');
var UploadHelper = require('../lib/UploadHelper');
var ppcModel = require('../models/ppcModel');

var appError = require('../app_error');
/**
 * @api {post} /deals Post Deal information
 * @apiVersion 0.1.0
 * @apiName PostDeal
 * @apiGroup Daily Deals
 *
 * @apiParam {json} daily_deal     Daily Deal json data
 * @apiParam {json} daily_deal_microsite     Daily Deal Microsite json data
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "daily_deal": {
 *       	"coupon_name": "coupon name",
 *		  	"coupon_image": "image_name",
 *		  	"deal_image": "deal_image_name",
 *		  	"coupon_generated_code": "CODE",
 *		  	"budget_limit": "100",
 *		  	"budget_period": "daily",
 *		  	"business_id": "3",
 *		  	"advertiser_id": "100",
 *		  	"start_date": "2017-03-03",
 *		  	"end_date": "2017-04-04",
 *		  	"regular_price": "50",
 *		  	"download_price": "10",
 *		  	"suggested_category_id": "6",
 *		  	"discount_type": "numeric"
 *       },
 *       
 *       "daily_deal_microsite": {
 *       	"name": "Deal name",
 *	  		"business_name": "business name",
 *	  		"image": "image_name",
 *	  		"address_1": "address_1",
 *	  		"address_2": "address_2",
 *	  		"state_id": "5",
 *	  		"city": "Las Vegas",
 *	  		"zip_code": "1234",
 *	  		"phone_number": "0023423423",
 *	  		"company_name": "company name",
 *	  		"daily_deal_description": "daily deal description",
 *	  		"what_you_get": "what you get",
 *	  		"image_1": "image_1",
 *	  		"image_2": "image_2",
 *	  		"code": "CODE",
 *	  		"download_file": "file name",
 *	  		"download_filename": "file title",
 *	  		"discount_daily_description": "discount description",
 *	  		"discount_description": "discount description",
 *	  		"location": "location",
 *	  		"discount_percentage": "15"
 *       }
 *     }
 *
 * @apiSuccess {Number} id  Id of created Deal.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id" : 153
 *     }
 */
router.post('/', function(req, res, next){
	
	var deal = req.body.daily_deal;
	var dealMicrosite = req.body.daily_deal_microsite;
	dealModel.saveDeal(deal, dealMicrosite).then(function(insertId){
		res.json({id: insertId});
	}, function(error){
		next(error);
	});
});

/**
 * @api {delete} /deals/:id Delete Deal
 * @apiVersion 0.1.0
 * @apiName DeleteDeal
 * @apiGroup Daily Deals
 *
 * @apiParam {Number} id     Daily Deal Id
 * 
 * @apiSuccess {Boolean} status True if delete operation succeeds else False.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     	"status": true
 *     }
 */
router.delete('/:id', function(req, res, next){
    var dealId = req.params.id;
    dealModel.deleteDeal(dealId).then(
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
 * @api {get} /deals Get All Deals
 * @apiVersion 0.1.0
 * @apiName GetAllDeals
 * @apiGroup Daily Deals
 *
 * @apiParam {String} include "downloads"
 *
 * @apiSuccess {Object[]} result  List of Daily Deals.
 * @apiSuccess {Number} page  Pagination Page Number.
 * @apiSuccess {Number} numRowsPerPage  Pagination Number of Rows Per Page.
 * @apiSuccess {Number} totalPages  Pagination Total Pages.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *		  "result": [
 *		    {
 *		      "id": 153,
 *		      "image": "deal_image_name",
 *		      "name": "Deal name",
 *		      "budget_limit": 100,
 *		      "budget_period": "daily",
 *		      "paused": 0,
 *		      "downloads": 0,
 *		      "available_fund": 100,
 *		      "approved_category_id": 6,
 *		      "download_price": 10,
 *		      "date_created": "2017-03-23T21:23:10.000Z",
 *		      "is_approved": 0
 *		    }
 *		  ],
 *		  "page": 1,
 *		  "numRowsPerPage": 10,
 *		  "totalRows": 1,
 *		  "totalPages": 1
 *		}
 */
router.get('/', function(req, res, next){

	dealModel.getAllDeals(req.query.page, req.query.include, req.query.numRowsPerPage).then(
		function(deals){
			res.json(deals);
		}, 
		function(error){
			next(error);
		}
	);
});

/**
 * @api {get} /deals/advertisers/:advertiserId Get Advertiser Deals
 * @apiVersion 0.1.0
 * @apiName GetAdvertiserDeals
 * @apiGroup Daily Deals
 *
 * @apiParam {Number} advertiserId     Advertiser Id
 *
 * @apiSuccess {Object[]} result  List of Advertiser Daily Deals.
 * @apiSuccess {Number} page  Pagination Page Number.
 * @apiSuccess {Number} numRowsPerPage  Pagination Number of Rows Per Page.
 * @apiSuccess {Number} totalPages  Pagination Total Pages.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *		  "result": [
 *		    {
 *		      "category_name": "Beauty and Spas",
 *		      "deal_id": 146,
 *		      "microsite_id": 165,
 *		      "company_name": null,
 *		      "what_you_get": "<ul>\n\t<li>50% off all perfumes</li>\n\t<li>Free Facial</li>\n</ul>\n",
 *		      "location": "10479 Brown Wolf St",
 *		      "end_date": "2017-03-29T21:00:00.000Z",
 *		      "start_date": "2017-03-07T21:00:00.000Z",
 *		      "discount_daily_description": "",
 *		      "discount_percentage": 0,
 *		      "discount_type": "text",
 *		      "name": "Discount Perfume",
 *		      "discount_price": null,
 *		      "budget_limit": 1000,
 *		      "budget_period": "weekly",
 *		      "image": "1488990852669459887.jpeg",
 *		      "image_1": "1488990913298512744.jpeg",
 *		      "image_2": "1488990917999789239.jpeg",
 *		      "code": "embeddable/html/code",
 *		      "date_created": "2017-03-08T16:36:45.000Z",
 *		      "download_price": 6,
 *		      "discount_description": "50% off all perfumes",
 *		      "regular_price": 0,
 *		      "discount_rate": 0,
 *		      "coupon_name": "Discount Perfume",
 *		      "coupon_generated_code": "j016qgqq",
 *		      "paused": 0,
 *		      "downloads": 0,
 *		      "available_fund": 1000,
 *		      "is_approved": 1,
 *		      "is_deleted": 0,
 *		      "list_rank": 0,
 *		      "deal_image": "image_name",
 *		      "daily_deal_description": "<p>Discount Perfumes at our following locations:</p>\n\n<ul>\n\t<li>2820 S. Jones Blvd. Las Vegas NV 89146</li>\n\t<li>817 S. Main St. Las Vegas NV 89101</li>\n</ul>\n",
 *		      "approved_category_id": 3
 *		    }
 *		  ],
 *		  "page": 1,
 *		  "numRowsPerPage": 10,
 *		  "totalRows": 1,
 *		  "totalPages": 1
 *		}
 */
router.get('/advertisers/:advertiserId', function(req, res, next){
	var advertiserId = req.params.advertiserId;
	dealModel.getAllDealsByAdvertiser(advertiserId, req.query.page, req.query.numRowsPerPage).then(
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


/**
 * @api {get} /deals/categories Get Deal Categories
 * @apiVersion 0.1.0
 * @apiName GetDealCategories
 * @apiGroup Daily Deals
 *
 * @apiSuccess {Object[]} categories List of Deal Categories.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *		  {
 *		    "category_id": 1,
 *		    "category_name": "Activities and Events"
 *		  },
 *		  {
 *		    "category_id": 2,
 *		    "category_name": "Automotive"
 *		  },
 *		  {
 *		    "category_id": 3,
 *		    "category_name": "Beauty and Spas"
 *		  },
 *		  {
 *		    "category_id": 4,
 *		    "category_name": "Food and Restaurants"
 *		  },
 *		  {
 *		    "category_id": 5,
 *		    "category_name": "Health and Fitness"
 *		  },
 *		  {
 *		    "category_id": 6,
 *		    "category_name": "Home and Garden"
 *		  },
 *		  {
 *		    "category_id": 7,
 *		    "category_name": "Home Services"
 *		  },
 *		  {
 *		    "category_id": 8,
 *		    "category_name": "Office Products and Services"
 *		  },
 *		  {
 *		    "category_id": 9,
 *		    "category_name": "Personal Services"
 *		  },
 *		  {
 *		    "category_id": 10,
 *		    "category_name": "Pets"
 *		  },
 *		  {
 *		    "category_id": 11,
 *		    "category_name": "Shopping"
 *		  },
 *		  {
 *		    "category_id": 12,
 *		    "category_name": "Travel"
 *		  }
 *		]
 */
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

/**
 * @api {post} /deals/upload?type=:imageType Upload Deal Images
 * @apiDescription Posible string values of imageType are: "deal", "deal_microsite", or "coupon". 
 * @apiVersion 0.1.0
 * @apiName UploadDealImages
 * @apiGroup Daily Deals
 * 
 * @apiSuccess {Object} imageInfo Uploaded Image Information.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *	      "banner_code":
 *	      "embeddable/html/code",
 *	      "banner_image_link":"path/to/image",
 *	      "banner_image_name":"image_name"
 *     }
 */
router.post('/upload', function(req, res, next){
	var uploadType = req.query.type;

	if(Object.keys(req.files).length === 0)
		return next(new appError('No file was uploaded.'));

	if(!uploadType)
		return next(new appError('Upload type not set.'));

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
			return next(new appError('Invalid upload type.'));
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

/**
 * @api {put} /deals/:dealId Update Deal information
 * @apiVersion 0.1.0
 * @apiName UpdateDeal
 * @apiGroup Daily Deals
 *
 * @apiParam {Number} dealId     Daily Deal Id
 * @apiParam {json} daily_deal     Daily Deal json data
 * @apiParam {json} daily_deal_microsite     Daily Deal Microsite json data
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "daily_deal": {
 *       	"coupon_name": "coupon name",
 *		  	"coupon_image": "image_name",
 *		  	"deal_image": "deal_image_name",
 *		  	"coupon_generated_code": "CODE",
 *		  	"budget_limit": "100",
 *		  	"budget_period": "daily",
 *		  	"business_id": "3",
 *		  	"advertiser_id": "100",
 *		  	"start_date": "2017-03-03",
 *		  	"end_date": "2017-04-04",
 *		  	"regular_price": "50",
 *		  	"download_price": "10",
 *		  	"suggested_category_id": "6",
 *		  	"discount_type": "numeric"
 *       },
 *       
 *       "daily_deal_microsite": {
 *       	"name": "Deal name",
 *	  		"business_name": "business name",
 *	  		"image": "image_name",
 *	  		"address_1": "address_1",
 *	  		"address_2": "address_2",
 *	  		"state_id": "5",
 *	  		"city": "Las Vegas",
 *	  		"zip_code": "1234",
 *	  		"phone_number": "0023423423",
 *	  		"company_name": "company name",
 *	  		"daily_deal_description": "daily deal description",
 *	  		"what_you_get": "what you get",
 *	  		"image_1": "image_1",
 *	  		"image_2": "image_2",
 *	  		"code": "CODE",
 *	  		"download_file": "file name",
 *	  		"download_filename": "file title",
 *	  		"discount_daily_description": "discount description",
 *	  		"discount_description": "discount description",
 *	  		"location": "location",
 *	  		"discount_percentage": "15"
 *       }
 *     }
 *
 * @apiSuccess {Boolean} status  True if update operation succeeds else False.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status" : true
 *     }
 */
router.put('/:dealId', function(req, res, next){
	var deal = req.body.daily_deal || {} ;
	var dealMicrosite = req.body.daily_deal_microsite || {};
	var dealId = req.params.dealId;

	dealModel.updateDeal(dealId, deal, dealMicrosite).then(
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
 * @api {put} /deals/:dealId/approve Approve Daily Deal
 * @apiVersion 0.1.0
 * @apiName ApproveDeal
 * @apiGroup Daily Deals
 *
 * @apiParam {Number} dealId     Daily Deal Id
 * @apiParam {Number} download_price     Download Price
 * @apiParam {Number} approved_category_id     Approved Category Id
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "download_price": 10,
 *       "approved_category_id": 5 
 *     }
 *
 * @apiSuccess {Boolean} status  True if approve operation succeeds else False.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status" : true
 *     }
 */
router.put('/:dealId/approve', function(req, res, next){
	
	var deal = {
		download_price: req.body.download_price,
		approved_category_id: req.body.approved_category_id,
		is_approved: 1
	}

	dealModel.partialUpdateDeal(req.params.dealId, deal).then(
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
 * @api {put} /deals/:dealId/disapprove Disapprove Daily Deal
 * @apiVersion 0.1.0
 * @apiName DispproveDeal
 * @apiGroup Daily Deals
 *
 * @apiParam {Number} dealId     Daily Deal Id
 *
 * @apiSuccess {Boolean} status  True if disapprove operation succeeds else False.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status" : true
 *     }
 */
router.put('/:dealId/disapprove', function(req, res, next){
	
	var deal = {
		is_approved: 0
	}

	dealModel.partialUpdateDeal(req.params.dealId, deal).then(
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
 * @api {put} /deals/:dealId/pause Pause Daily Deal
 * @apiVersion 0.1.0
 * @apiName PauseDeal
 * @apiGroup Daily Deals
 *
 * @apiParam {Number} dealId     Daily Deal Id
 *
 * @apiSuccess {Boolean} status  True if pause operation succeeds else False.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status" : true
 *     }
 */
router.put('/:dealId/pause', function(req, res, next){
	
	var deal = {
		paused: 1
	}

	dealModel.partialUpdateDeal(req.params.dealId, deal).then(
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
 * @api {put} /deals/:dealId/unpause Unpause Daily Deal
 * @apiVersion 0.1.0
 * @apiName UnpauseDeal
 * @apiGroup Daily Deals
 *
 * @apiParam {Number} dealId     Daily Deal Id
 *
 * @apiSuccess {Boolean} status  True if unpause operation succeeds else False.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status" : true
 *     }
 */
router.put('/:dealId/unpause', function(req, res, next){
	
	var deal = {
		paused: 0
	}

	dealModel.partialUpdateDeal(req.params.dealId, deal).then(
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
 * @api {get} /deals/:dealId Get Deal
 * @apiVersion 0.1.0
 * @apiName GetDeal
 * @apiGroup Daily Deals
 *
 * @apiParam {Number} dealId Daily Deal Id
 *
 * @apiSuccess {Object} deal  Daily Deal Information
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *		  "category_name": "Home and Garden",
 *		  "deal_id": 152,
 *		  "microsite_id": 172,
 *		  "company_name": "company name",
 *		  "what_you_get": "what you get",
 *		  "location": "location",
 *		  "end_date": "2017-04-03T21:00:00.000Z",
 *		  "start_date": "2017-03-02T21:00:00.000Z",
 *		  "discount_daily_description": "discount description",
 *		  "discount_percentage": 15,
 *		  "discount_type": "numeric",
 *		  "name": "Deal name",
 *		  "discount_price": null,
 *		  "budget_limit": 100,
 *		  "coupon_image": "image_name",
 *		  "budget_period": "daily",
 *		  "advertiser_id": 100,
 *		  "paused": 0,
 *		  "image": "image_name",
 *		  "image_1": "image_1",
 *		  "image_2": "image_2",
 *		  "code": "CODE",
 *		  "date_created": "2017-03-23T21:17:06.000Z",
 *		  "download_price": 10,
 *		  "discount_description": "discount description",
 *		  "regular_price": 50,
 *		  "discount_rate": null,
 *		  "coupon_name": "coupon name",
 *		  "coupon_generated_code": "CODE",
 *		  "is_approved": 0,
 *		  "is_deleted": 0,
 *		  "list_rank": 0,
 *		  "deal_image": "deal_image_name",
 *		  "daily_deal_description": "daily deal description",
 *		  "lat": "-25.7394229",
 *		  "lng": "28.1758982",
 *		  "approved_category_id": 6,
 *		  "suggested_category_id": 6,
 *		  "city": "Las Vegas",
 *		  "state_id": "5",
 *		  "zip_code": "1234",
 *		  "usa_state_name": "California"
 *		}
 */
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