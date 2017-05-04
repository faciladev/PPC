var express = require('express');
var router = express.Router();
var ppcModel = require('../models/ppcModel');
var userModel = require('../models/userModel');
var adModel = require('../models/ads');
var Util = require('../lib/util');

var appError = require('../app_error');

/**
 * @api {get} /click/deals/:dealId/:redirectUrl/:userId Member Click Tracking of Daily Deals
 * @apiVersion 0.1.0
 * @apiName MemberClickTrackingofDailyDeals
 * @apiGroup Daily Deals
 *
 * @apiParam {Number} dealId  Daily Deal Id.
 * @apiParam {String} redirectUrl  Redirect URL After Click Tracking.
 * @apiParam {Number} userId  User Id.
 */
router.get('/deals/:dealId/:redirectUrl/:userId', function(req, res, next){
	clickDeal(req, res, next);
});

/**
 * @api {get} /click/adoffers/:offerId/:userId Member Save Sponsored Ad Offers
 * @apiVersion 0.1.0
 * @apiName MemberSaveSponsoredAdOffers
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} offerId  Offer Id.
 * @apiParam {Number} userId  User Id.
 */
router.get('/adoffers/:offerId/:userId', function(req, res, next){
	ppcModel.saveConsumerAdOffer(req.params.userId, req.params.offerId).then(
		(response)=>{
			return res.json({status: true, message: "ad offer saved."});
		}, 
		(error)=>{
			return next(error);
		}
	);
});

/**
 * @api {get} /click/deals/:dealId/:redirectUrl Non-Member Click Tracking of Daily Deals
 * @apiVersion 0.1.0
 * @apiName Non-MemberClickTrackingofDailyDeals
 * @apiGroup Daily Deals
 *
 * @apiParam {Number} dealId  Daily Deal Id.
 * @apiParam {String} redirectUrl  Redirect URL After Click Tracking.
 */
router.get('/deals/:dealId/:redirectUrl', function(req, res, next){
	clickDeal(req, res, next);
});

/**
 * @api {get} /click/ads/:searchId/:redirectUrl/:userId Member Click Tracking of Sponsored Ads
 * @apiVersion 0.1.0
 * @apiName MemberClickTrackingofSponsoredAds
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} searchId  Search Id.
 * @apiParam {String} redirectUrl  Redirect URL After Click Tracking.
 * @apiParam {Number} userId  User Id.
 */
router.get('/ads/:searchId/:redirectUrl/:userId', function(req, res, next){
	clickSponsoredAd(req, res, next);
});

/**
 * @api {get} /click/ads/:searchId/:redirectUrl Non-Member Click Tracking of Sponsored Ads
 * @apiVersion 0.1.0
 * @apiName NonMemberClickTrackingofSponsoredAds
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} searchId  Search Id.
 * @apiParam {String} redirectUrl  Redirect URL After Click Tracking.
 */
router.get('/ads/:searchId/:redirectUrl', function(req, res, next){
	clickSponsoredAd(req, res, next);
});

/**
 * @api {get} /click/f_ads/:adId/:subpageId/:redirectUrl Non-Member Click Tracking of Featured Sponsored Ads
 * @apiVersion 0.1.0
 * @apiName NonMemberClickTrackingofFeaturedSponsoredAds
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} adId  Sponsored Ad Id.
 * @apiParam {Number} subpageId  Subpage Id.
 * @apiParam {String} redirectUrl  Redirect URL After Click Tracking.
 */
router.get('/f_ads/:adId/:subPageId/:redirectUrl', function(req, res, next){
	clickFeaturedAd(req, res, next);
});

/**
 * @api {get} /click/f_ads/:adId/:subpageId/:redirectUrl/:userId Member Click Tracking of Featured Sponsored Ads
 * @apiVersion 0.1.0
 * @apiName MemberClickTrackingofFeaturedSponsoredAds
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} adId  Sponsored Ad Id.
 * @apiParam {Number} subpageId  Subpage Id.
 * @apiParam {String} redirectUrl  Redirect URL After Click Tracking.
 * @apiParam {Number} userId  User Id.
 */
router.get('/f_ads/:adId/:subPageId/:redirectUrl/:userId', function(req, res, next){
	clickFeaturedAd(req, res, next);
});

/**
 * @api {get} /click/flexoffers/:flexSearchId/:redirectUrl Non-Member Click Tracking of Flex Offers
 * @apiVersion 0.1.0
 * @apiName Non-MemberClickTrackingofFlexOffers
 * @apiGroup Flex Offers
 *
 * @apiParam {Number} flexSearchId  Flex Search Id.
 * @apiParam {String} redirectUrl  Redirect URL After Click Tracking.
 */
router.get('/flexoffers/:flexSearchId/:redirectUrl', function(req, res, next){
	clickFlexOffer(req, res, next);
});

/**
 * @api {get} /click/flexoffers/:flexSearchId/:redirectUrl/:userId Member Click Tracking of Flex Offers
 * @apiVersion 0.1.0
 * @apiName MemberClickTrackingofFlexOffers
 * @apiGroup Flex Offers
 *
 * @apiParam {Number} flexSearchId  Flex Search Id.
 * @apiParam {String} redirectUrl  Redirect URL After Click Tracking.
 * @apiParam {Number} userId User Id.
 */
router.get('/flexoffers/:flexSearchId/:redirectUrl/:userId', function(req, res, next){
	clickFlexOffer(req, res, next);
});

var clickFeaturedAd = function(req, res, next){
	var adId = parseInt(req.params.adId) || null;
	var subPageId = parseInt(req.params.subPageId) || null;
	var redirectUrl = req.params.redirectUrl;
	var userId = req.params.userId;

	adModel.getOneFeaturedAd(adId, subPageId).then(function(searchData){

		if(! searchData.ad_id)
			return next(new appError('No featured ad found with that id or in that subpage.'));

		var userAgent = Util.getUserAgent(req);
		var ip = Util.getClientIp(req);

		var data = {
			activity_type_id: ppcModel.ACTIVITY_CLICK,
			item_type_id: ppcModel.ITEM_SPONSORED_AD,
		};

		if(! isNaN(userId))
			data.actor_id = parseInt(userId);

		//Make sure if click meets click policy
		ppcModel.requestMeetsClickPolicy(
			ip, 
			userAgent, 
			data, 
			userId).then(
			function(hasPassed){

				//Check if click failed click policy.
				if(! hasPassed){
					//Set fraudulent flag to 1
					searchData.fraudulent = 1;
				} else {
					//Set fraudulent flag to 0
					searchData.fraudulent = 0;
				}

				//Checks if ad has available budget for its budget period
				// to allow trackable clicks
				ppcModel.adBudgetLimitCheck(searchData).then(
					function(response){

						//No available fund remains
						if(response.has_passed === 0){
							
							//Do not track click
							//Update 'available_since' field so future searches won't include this ad
							ppcModel.postponeAdAvailability(searchData.ad_id).then(
								function(response){
									
									res.redirect(Util.decodeUrl(redirectUrl));
								},
								function(error){
									next(error);
								}
							);

						} 
						//Ad has available funds for clicks
						else {

							//Ad's available fund is below 10% of budget limit.
							if(response.low_budget === 1){

								//TODO

								//Check if notification is sent regarding this ad's budget availability
								//If it hasn't been sent then send one.
								//If it has been sent do nothing.

								ppcModel.trackSponsoredAdClick(searchData, ip, userAgent, userId, true).then(
									function(response){
										res.redirect(Util.decodeUrl(redirectUrl));
									},
									function(error){
										next(error);
									}
								);

								

							} 

							//Ad's availble fund is greater than 10% of budget limit.
							else {
								
								ppcModel.trackSponsoredAdClick(searchData, ip, userAgent, userId, true).then(
									function(response){
										res.redirect(Util.decodeUrl(redirectUrl));
									},
									function(error){
										next(error);
									}
								);
							}

								
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
	}, function(error){
		next(error);
	});

		


}

var clickSponsoredAd = function(req, res, next){
	var searchId = req.params.searchId;
	var redirectUrl = req.params.redirectUrl;
	var userId = req.params.userId; 

	//Check if click is generated by a valid search
	ppcModel.getAdSearchById(searchId).then(
		function(searchData){

			if(searchData.length <= 0)
				return next(new appError('No search was found to generate this click.'));

			var userAgent = Util.getUserAgent(req);
			var ip = Util.getClientIp(req);

			var data = {
				activity_type_id: ppcModel.ACTIVITY_CLICK,
				item_type_id: ppcModel.ITEM_SPONSORED_AD,
			};

			if(! isNaN(userId))
				data.actor_id = parseInt(userId);


			//Make sure if click meets click policy
			ppcModel.requestMeetsClickPolicy(
				ip, 
				userAgent, 
				data, 
				userId).then(
				function(hasPassed){

					//Check if click failed click policy.
					if(! hasPassed){
						//Set fraudulent flag to 1
						searchData.fraudulent = 1;
					} else {
						//Set fraudulent flag to 0
						searchData.fraudulent = 0;
					}

					//Checks if ad has available budget for its budget period
					// to allow trackable clicks
					ppcModel.adBudgetLimitCheck(searchData).then(
						function(response){

							//No available fund remains
							if(response.has_passed === 0){
								
								//Do not track click
								//Update 'available_since' field so future searches won't include this ad
								ppcModel.postponeAdAvailability(searchData.ad_id).then(
									function(response){
										
										res.redirect(Util.decodeUrl(redirectUrl));
									},
									function(error){
										next(error);
									}
								);

							} 
							//Ad has available funds for clicks
							else {

								//Ad's available fund is below 10% of budget limit.
								if(response.low_budget === 1){

									//TODO

									//Check if notification is sent regarding this ad's budget availability
									//If it hasn't been sent then send one.
									//If it has been sent do nothing.

									ppcModel.trackSponsoredAdClick(searchData, ip, userAgent, userId).then(
										function(response){
											res.redirect(Util.decodeUrl(redirectUrl));
										},
										function(error){
											next(error);
										}
									);

									

								} 

								//Ad's availble fund is greater than 10% of budget limit.
								else {
									
									ppcModel.trackSponsoredAdClick(searchData, ip, userAgent, userId).then(
										function(response){
											res.redirect(Util.decodeUrl(redirectUrl));
										},
										function(error){
											next(error);
										}
									);
								}

									
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

            const link = searchData.url;
            

			ppcModel.trackFlexClick(searchData, ip, userAgent, userId).then(
				function(response){
					if(! link)
						return res.status(appError.HttpErrorCodes.NotFound).json({error: "Flex offer doesn't have a valid link"});

					res.redirect(link);
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