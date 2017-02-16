var express = require('express');
var config = require('config');

var router = express.Router();
var ppcModel = require('../models/ppcModel');
var Util = require('../lib/util');

//Non-member search
router.get('/ads/:keyword/:location/:subPage', function(req, res, next){
	searchAds(req, res, next);
});

//Member search
router.get('/ads/:keyword/:location/:subPage/:userId', function(req, res, next) {
	searchAds(req, res, next);
});

//Get deals from one category
router.get('/deals/:categoryId', function(req, res, next) {
	ppcModel.getDealsByCategory(req.params.categoryId, req.query.page).then(
		function(deals){
			res.json(deals);
		}, 
		function(error){		
			next(error);
		}
	)
});

//Non-member search
router.get('/deals/:categoryId/:keyword', function(req, res, next){
	searchDeals(req, res, next);
});

//Member search
router.get('/deals/:categoryId/:keyword/:userId', function(req, res, next){
	searchDeals(req, res, next);
});

//Get deals from all categories
router.get('/deals', function(req, res, next) {
	var limit = req.query.limit;
	if(typeof limit === 'undefined' || limit === null)
		limit = config.get('numRowsPerPage');

	ppcModel.getDealsFromEachCategory(limit).then(
		function(deals){
			res.json(deals);
		}, 
		function(error){
		console.log(error)			
			next(error);
		}
	)
});

//Return flex offers by subpage id
router.get('/flexoffers/:subpageId',
    function(req, res, next) {
    	searchFlex(req, res, next);
    }
);

//Return flex offers by subpage id and keyword
router.get('/flexoffers/:subpageId/:keyword',
    function(req, res, next) {
    	searchFlex(req, res, next);
    }
);

var searchFlex = function(req, res, next){
	var subpageId = req.params.subpageId;
	var keyword = req.params.keyword;

    ppcModel.findFlexOffers(subpageId, keyword, req.query.page).then(function(response){
        var flexoffers = response.result;
        if(flexoffers.length > 0){

            //Extract flex offer image source from link
            for(var i=0; i<flexoffers.length; i++){
                var startIndex = flexoffers[i].flexoffer_link_content.indexOf("src=");
                var lastIndex = flexoffers[i].flexoffer_link_content.indexOf(" ", startIndex);
                var url = flexoffers[i].flexoffer_link_content.substring(startIndex + 5, lastIndex - 1);
                var hrefStartIdx = flexoffers[i].flexoffer_link_content.indexOf("href=");
                var hrefEndIdx = flexoffers[i].flexoffer_link_content.indexOf(" ", hrefStartIdx);
                var link = flexoffers[i].flexoffer_link_content.substring(hrefStartIdx + 6, hrefEndIdx - 1);
                var redirectUrl = Util.sanitizeUrl(link);
                flexoffers[i].flexSrc = url;
                flexoffers[i].flexLink = link;
                flexoffers[i].url = config.get('project_url') + 
                    '/api/click/flexoffers/' + flexoffers[i].flexoffer_link_id + '/' +
                    redirectUrl;
            }
        }

        res.json(response);

    }, function(error){
        next(error);
    });
}

var searchAds = function(req, res, next){
	var keyword = req.params.keyword;
	var location = req.params.location;
	var subPage = req.params.subPage;
	var userId = req.params.userId;

	ppcModel.findSponsoredAds(keyword, location, subPage, req.query.page).then(
		function(searchData){
			var paginatedSearchData = searchData;
			searchData = searchData.result;

			if(searchData.length <= 0)
				return res.json(searchData);

			//Save searches
			ppcModel.saveSponsoredAdSearch(searchData).then(
				function(savedSearchIds){
					
					if(searchData.length === 1 && (savedSearchIds.affectedRows === 1)){
						//matched one result
						searchData[0].search_id = savedSearchIds.insertId;
					}
					else if(searchData.length > 1 && (savedSearchIds.length === searchData.length)){
						//matched multiple results
						for(var i = 0; i<searchData.length; i++){
	                        var redirectUrl = Util.sanitizeUrl(config.get('web_portal_url') + '/' + 
	                            'ad_microsite/' + searchData[i].ad_id);

	                        searchData[i].url = config.get('project_url') + 
	                        '/api/click/ads/' + savedSearchIds[i].insertId + '/' +
	                        redirectUrl
	                        ;
	                    }
					}
					else {
						next(new Error('Matched and saved search data inconsistent.'));
					}

					
					

					var ip = Util.getClientIp(req);
					var userAgent = Util.getUserAgent(req);

					//Log impression
					ppcModel.trackSponsoredAdImpression(savedSearchIds, ip, userAgent, userId).then(
						function(response){
							res.json(paginatedSearchData);
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
}

var searchDeals = function(req, res, next) {
	var keyword = req.params.keyword;
	var categoryId = req.params.categoryId;
	var userId = req.params.userId;

	ppcModel.findDailyDeals(keyword, categoryId, req.query.page).then(
		function(searchData){
			var userAgent = Util.getUserAgent(req);
			var ip = Util.getClientIp(req);

			if(searchData.result.length <= 0)
				return res.json([]);

			//Log impression
			ppcModel.trackDailyDealImpression(searchData.result, ip, userAgent, userId).then(
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
	)
}





module.exports = router;