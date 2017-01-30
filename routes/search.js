var express = require('express');
var router = express.Router();
var ppcModel = require('../models/ppcModel');
var Util = require('../lib/util');


router.get('/ad/:keyword/:location/:subpage', function(req, res, next) {
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
					ppcModel.trackSponsoredAdImpression(savedSearchIds, ip, userId).then(
						function(response){

						}, 
						function(error){
							next(error);
						}
					);

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
	)
});

router.get('/deal/:keyword', function(req, res, next) {
	var keyword = req.params.keyword;
	var userId; //get user from cookie

	ppcModel.findDailyDeals(keyword).then(
		function(searchData){
			if(searchData.length <= 0)
				return res.json(searchData);

			var ip = Util.getClientIp(req);

			//Log impression
			ppcModel.trackDailyDealImpression(searchData, ip, userId).then(
				function(response){

				}, 
				function(error){
					next(error);
				}
			);

			res.json(searchData);
		}, 
		function(error){			
			next(error);
		}
	)
});



module.exports = router;