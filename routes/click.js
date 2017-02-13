var express = require('express');
var router = express.Router();
var ppcModel = require('../models/ppcModel');
var userModel = require('../models/userModel');
var Util = require('../lib/util');

router.get('/ad/:searchId/:redirectUrl', function(req, res, next){
	var searchId = req.params.searchId;
	var redirectUrl = req.params.redirectUrl;
	var userId; //get user from cookie

	//Check if click is generated by a valid search
	ppcModel.getAdSearchById(searchId).then(
		function(searchData){
			if(searchData.length <= 0)
				next(new Error('No search was found to generate this click.'));

			var userAgent = Util.getUserAgent();
			var ip = Util.getClientIp(req);

			//Make sure if click meets click policy
			ppcModel.requestMeetsClickPolicy(ip, userAgent).then(
				function(hasPassed){
					if(! hasPassed){
						//Save fraud click
						ppcModel.saveFraudClick(ip, userAgent, userId);
						next(new Error('Fraud click.'));
					}

					//Update sponsored ad 'available_since' field if budget limit exceeded.
					ppcModel.adBudgetLimitCheck(searchData).then(
						function(response){
							if(! response.hasPassed){
								//Do not track click
								//Update 'available_since' field so future searches won't include this ad
								ppcModel.postponeAdAvailability(searchData.ad_id, response.budget_period).then(
									function(response){
										res.redirect(Util.decodeUrl(redirectUrl));
									},
									function(error){
										next(error);
									}
								);
							} else {

								//Track click
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

});

router.get('/deal/:dealId/:userId/:redirectUrl', function(req, res, next){
	var dealId = req.params.dealId;
	var redirectUrl = req.params.redirectUrl;
	var userId = req.params.userId;

	userModel.getUser(userId).then(
		function(user){
			ppcModel.getDealById(dealId).then(
				function(deal){

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
							console.log('here yy');
							ppcModel.trackDealClick(deal, ip, userAgent, userId).then(
								function(response){
									console.log('here xx');
									res.redirect(Utile.decodeUrl(redirectUrl));
								},
								function(error){
									next(error);
								}
							);

							//TODO
							//1) Budget limit check
							//2)availability check

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
	)

			

});

module.exports = router;