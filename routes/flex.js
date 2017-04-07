var express = require('express');

var router = express.Router();

var offerModel = require('../models/offerModel');
var Util = require('../lib/util');
var appError = require('../app_error');

/**
 * @api {get} /flex/:flexId Get Flex Offers By Id
 * @apiVersion 0.1.0
 * @apiName GetFlexOffersById
 * @apiGroup Flex Offers
 *
 * @apiParam {Number} flexId  Flex Offer Id.
 *
 * @apiSuccess {Object} flexoffer A flex offer object for :flexId.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *	   {
 *	     "flexoffer_link_id": 36057,
 *	     "flexoffer_link_content": "embeddable/code",
 *	     "flexoffer_link_subpage_id": 1,
 *	     "flexoffer_link_featured": 0,
 *	     "flexoffer_list_order": 0,
 *	     "flexoffer_list_order_asc": 1000,
 *	     "flexoffer_name": "local offer",
 *	     "keyword_id": null,
 *	     "flexSrc": "image_src",
 *	     "flexLink": "image_link",
 *	   }
 */
router.get('/:flexId', function(req, res, next){
    var flexId = parseInt(req.params.flexId);
	offerModel.getFlexOffersById(flexId).then(
		function(flex){
			if(!flex) 
				return res.status(appError.HttpErrorCodes.NotFound).json({error: "Flex offer doesn't exist"});

			res.json(flex);
		}, 
		function(error){
			next(error);
		}
	);
});

module.exports = router;