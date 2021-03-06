var express = require('express');
var router = express.Router();
var ppcModel = require('../models/ppcModel');
var userModel = require('../models/userModel');
var Util = require('../lib/util');

/**
 * @api {get} /download/deals/:dealId Track Non-member Deal Download (Web and Mobile)
 * @apiVersion 0.1.0
 * @apiName TrackNonMemberDealDownload
 * @apiGroup Daily Deals
 *
 * @apiParam {Number} dealId     Daily Deal Id
 *
 * @apiSuccess {Boolean} status  True if download operation succeeds else False.
 * @apiSuccess {String} message  Confirmation message about the operation.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     		"status": true, 
 *     		"message": "download tracked."
 *     }
 */
router.get('/deals/:dealId', function(req, res, next){
	downloadDeal(req, res, next);
});

/**
 * @api {get} /download/deals/:dealId/:userId Track Member Deal Download
 * @apiVersion 0.1.0
 * @apiName TrackMemberDealDownload
 * @apiGroup Daily Deals
 *
 * @apiParam {Number} dealId     Daily Deal Id
 * @apiParam {Number} userId     User Id
 *
 * @apiSuccess {Boolean} status  True if download operation succeeds else False.
 * @apiSuccess {String} message  Confirmation message about the operation.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     		"status": true, 
 *     		"message": "download tracked."
 *     }
 */
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

			var data = {
				activity_type_id: ppcModel.ACTIVITY_DOWNLOAD,
				item_type_id: ppcModel.ITEM_DAILY_DEAL,
				item_id: parseInt(dealId)
			};

			if(! isNaN(userId))
				data.actor_id = parseInt(userId);

			//Make sure if click meets click policy
			ppcModel.requestMeetsClickPolicy(ip, userAgent, data, userId).then(
				function(hasPassed){
					//Check if click failed click policy.
					if(! hasPassed){
						//Set fraudulent flag to 1
						deal.fraudulent = 1;
						deal.ppc_analytics_status = ppcModel.FRAUDULENT_ANALYTICS_STATUS;
					} else {
						//Set fraudulent flag to 0
						deal.fraudulent = 0;
						deal.ppc_analytics_status = ppcModel.APPROVED_ANALYTICS_STATUS;
					}

					ppcModel.dealBudgetLimitCheck(deal).then(
						function(response){

							//No available fund remains
							if(response.has_passed === 0){
								
								//Do not track download
								res.json({status: false, message:'Download budget limit exceeded.'});

							} 
							//Deal has available funds for download
							else {

								//Ad's available fund is below 10% of budget limit.
								if(response.low_budget === 1){

									//TODO

									//Check if notification is sent regarding this deal's budget availability
									//If it hasn't been sent then send one.
									//If it has been sent do nothing.

									ppcModel.trackDealDownload(deal, ip, userAgent, userId).then(
										function(response){
											res.json({status: true, message:'download tracked.'});
										},
										function(error){
											next(error);
										}
									);

									

								} 

								//Deal's availble fund is greater than 10% of budget limit.
								else {
									
									ppcModel.trackDealDownload(deal, ip, userAgent, userId).then(
										function(response){
											res.json({status: true, message:'download tracked.'});
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

module.exports = router;