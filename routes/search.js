var express = require('express');
var router = express.Router();
var ppcModel = require('../models/ppcModel');
var Util = require('../lib/util');


router.get('/ads/:keyword/:location/:subpage', function(req, res, next) {
	var keyword = req.params.keyword;
	var location = req.params.location;
	var subpage = req.params.subpage;
	var userId; //get user from cookie

	ppcModel.findSponsoredAds(keyword, location, subpage).then(
		function(searchData){
			if(searchData.length <= 0)
				return res.json(searchData);

			//Save searches
			ppcModel.saveSponsoredAdSearch(searchData).then(
				function(savedSearchIds){
					

					if(searchData.length !== savedSearchIds.length){
						next(new Error('Matched and saved search data inconsistent.'));
					}

					//Attach search id with search result
					for(var i = 0; i<searchData.length; i++)
						searchData[i].search_id = savedSearchIds[i].insertId;

					var ip = Util.getClientIp(req);

					//Log impression
					ppcModel.trackSponsoredAdImpression(savedSearchIds, ip, userAgent, userId).then(
						function(response){
							
							res.json(searchData);
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

router.get('/deals/:categoryId/:keyword/:userId', function(req, res, next) {
	var keyword = req.params.keyword;
	var categoryId = req.params.categoryId;
	var userId = req.params.userId;
	console.log(keyword + categoryId + userId);

	ppcModel.findDailyDeals(keyword, categoryId, req.query.page).then(
		function(searchData){
			console.log(searchData);res.json(searchData);return;

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
					//Log impression
					ppcModel.trackDailyDealImpression(searchData, ip, userAgent, userId).then(
						function(response){
							res.json(searchData);
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
	)
});


router.get('/deals', function(req, res, next) {
	ppcModel.getDealsFromEachCategory(8).then(
		function(deals){
			res.json(deals);
		}, 
		function(error){
		console.log(error)			
			next(error);
		}
	)
});

router.get('/deals/:categoryId', function(req, res, next) {
	ppcModel.getDealsByCategory(req.params.categoryId, req.query.page).then(
		function(deals){
			res.json(deals);
		}, 
		function(error){
		console.log(error)			
			next(error);
		}
	)
});


module.exports = router;