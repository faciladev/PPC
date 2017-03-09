var express = require('express');
var router = express.Router();
var ppcModel = require('../models/ppcModel');
var userModel = require('../models/userModel');
var Util = require('../lib/util');

//Deal click for members
router.get('/deals/:dealId/:redirectUrl/:userId', function(req, res, next){
	clickDeal(req, res, next);
});

//Deal click for non-members
router.get('/deals/:dealId/:redirectUrl', function(req, res, next){
	clickDeal(req, res, next);
});

//Sponsored ad click tracking for members
router.get('/ads/:searchId/:redirectUrl/:userId', function(req, res, next){
	clickSponsoredAd(req, res, next);
});

//Sponsored ad click tracking for non-members
router.get('/ads/:searchId/:redirectUrl', function(req, res, next){
	clickSponsoredAd(req, res, next);
});

//Flex offer click tracking for non-members
router.get('/flexoffers/:flexSearchId/:redirectUrl', function(req, res, next){
	clickFlexOffer(req, res, next);
});

//Flex offer click tracking for members
router.get('/flexoffers/:flexSearchId/:redirectUrl/:userId', function(req, res, next){
	clickFlexOffer(req, res, next);
});

var clickSponsoredAd = function(req, res, next){
	var searchId = req.params.searchId;
	var redirectUrl = req.params.redirectUrl;
	var userId = req.params.userId; 

	//Check if click is generated by a valid search
	ppcModel.getAdSearchById(searchId).then(
		function(searchData){
			if(searchData.length <= 0)
				next(new Error('No search was found to generate this click.'));

			var userAgent = Util.getUserAgent(req);
			var ip = Util.getClientIp(req);

			//Make sure if click meets click policy
			ppcModel.requestMeetsClickPolicy(ip, userAgent).then(
				function(hasPassed){
					if(! hasPassed){
						//Save fraud click
						ppcModel.saveFraudClick(ip, userAgent, userId);
						next(new Error('Fraud click.'));
					}

					ppcModel.adBudgetLimitCheck(searchData).then(
						function(response){
							if(! response.hasPassed){
								console.log(response);
								//Do not track click
								//Update 'available_since' field so future searches won't include this ad
								// ppcModel.postponeAdAvailability(searchData.ad_id, response.budget_period).then(
								// 	function(response){
								// 		res.redirect(Util.decodeUrl(redirectUrl));
								// 	},
								// 	function(error){
								// 		next(error);
								// 	}
								// );
							} else {
								console.log(response);
								ppcModel.trackSponsoredAdClick(searchData, ip, userAgent, userId).then(
									function(response){
										res.redirect(Util.decodeUrl(redirectUrl));
									},
									function(error){
										next(error);
									}
								);
							}
								
						}, 
						function(error){
							next(error);
						}
					);
				},
				function(error){
					next(error);
				}
			);
		}, 
		function(error){
			next(error);
		}
	);
}

var clickDeal = function(req, res, next){
	var dealId = req.params.dealId;
	var redirectUrl = req.params.redirectUrl;
	var userId = req.params.userId;
	
	ppcModel.getDealById(dealId).then(
		function(deal){
			var userAgent = Util.getUserAgent(req);
			var ip = Util.getClientIp(req);

			//TODO
			//1) Budget limit check
			//2)availability check

			ppcModel.trackDealClick(deal, ip, userAgent, userId).then(
				function(response){
					res.redirect(Util.decodeUrl(redirectUrl));
				},
				function(error){
					next(error);
				}
			);

		}, 
		function(error){
			next(error);
		}
	);
}

var clickFlexOffer = function(req, res, next){
	var flexSearchId = req.params.flexSearchId;
	var redirectUrl = req.params.redirectUrl;
	var userId = req.params.userId;
	
	ppcModel.getFlexSearchById(flexSearchId).then(
		function(searchData){
			var userAgent = Util.getUserAgent(req);
			var ip = Util.getClientIp(req);

			ppcModel.trackFlexClick(searchData, ip, userAgent, userId).then(
				function(response){
					res.redirect(Util.decodeUrl(redirectUrl));
				},
				function(error){
					next(error);
				}
			);

		}, 
		function(error){
			next(error);
		}
	);
}

module.exports = router;