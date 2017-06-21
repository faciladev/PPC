var express = require('express');

var router = express.Router();

var offerModel = require('../models/offerModel');
var Util = require('../lib/util');

/**
 * @api {get} /offer/:advertiserId Get Advertiser Offers
 * @apiVersion 0.1.0
 * @apiName GetAdvertiserOffers
 * @apiGroup ZiphubOffer
 * @apiParam {Number} Advertiser Id
 * @apiSuccess {Object} response  Offer data
 *
 */
router.get('/:advertiserId', function(req, res, next){
    var advertiserId = req.params.advertiserId;
	offerModel.getAllByAdvertiser(advertiserId).then(
		function(offers){
			res.json(offers);
		}, 
		function(error){
			next(error);
		}
	);
});

module.exports = router;