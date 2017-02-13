var express = require('express');
var router = express.Router();
var ppcModel = require('../models/ppcModel');
var userModel = require('../models/userModel');
var Util = require('../lib/util');

//Track deal download
router.get('/deals/:dealId/:userId', function(req, res, next){
	downloadDeal(req, res, next);
});

var downloadDeal = function(req, res, next){
	var dealId = req.params.dealId;
	var userId = req.params.userId;
	
	ppcModel.getDealById(dealId).then(
		function(deal){
			var userAgent = Util.getUserAgent(req);
			var ip = Util.getClientIp(req);

			//TODO
			//1) Budget limit check
			//2)availability check

			//Make sure if click meets click policy
			ppcModel.requestMeetsClickPolicy(ip, userAgent).then(
				function(hasPassed){
					if(! hasPassed){
						//Save fraud click
						ppcModel.saveFraudClick(ip, userAgent, userId);
						next(new Error('Fraud click.'));
					}
					console.log(hasPassed);

					ppcModel.trackDealDownload(deal, ip, userAgent, userId).then(
						function(response){
							res.json({status: true, message:'download tracked.'});
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

module.exports = router;