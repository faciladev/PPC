var express = require('express');
var router = express.Router();
var searchModel = require('../models/searchModel');


router.get('/ad/:keyword/:location/:subpage', function(req, res, next) {
	var keyword = req.params.keyword;
	var location = req.params.location;
	var subpage = req.params.subpage;
	var userId; //get user from cookie

	searchModel.findSponsoredAds(keyword, location, subpage).then(
		function(searchData){
			//Save searches
			searchModel.saveSponsoredAdSearch(searchData).then(
				function(savedSearchIds){
					

					if(searchData.length !== savedSearchIds.length){
						next(new Error('Matched and saved search data inconsistent.'));
					}

					//Attach search id with search result
					for(var i = 0; i<searchData.length; i++)
						searchData[i].search_id = savedSearchIds[i].insertId;

					//Log impression
					searchModel.trackSponsoredAdImpression(savedSearchIds, userId).then(
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

			res.json(response);
		}, 
		function(error){			
			next(error);
		}
	)
});

module.exports = router;