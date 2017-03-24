var express = require('express');
var router = express.Router();
var ppcModel = require('../models/ppcModel');
var userModel = require('../models/userModel');
var Util = require('../lib/util');

/**
 * @api {get} /analytics/ads/:adId Get Sponsored Ad Analytics
 * @apiVersion 0.1.0
 * @apiName GetSponsoredAdAnalytics
 * @apiGroup Sponsored Ads
 *
 * @apiParam {Number} adId  Sponsored Ad Id.
 *
 * @apiSuccess {Object[]} adAnalytics List of Sponsored Ad Analytics.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *		  {
 *		    "item_type_id": 1,
 *		    "keyword": "Elegant",
 *		    "activity_type_id": 2,
 *		    "actor_type_id": 4,
 *		    "item_id": 1018,
 *		    "actor_id": 409,
 *		    "activity_time": "2017-03-09T15:51:29.000Z",
 *		    "ip_address": "::ffff:172.31.17.91",
 *		    "user_agent": "Chromium 56.0.2924 / Ubuntu 0.0.0",
 *		    "device_version": "Other 0.0.0",
 *		    "ad_id": 144,
 *		    "keyword_id": 2862,
 *		    "keyword_category_id": 8,
 *		    "ad_location_id": 156,
 *		    "ad_subpage_id": 1,
 *		    "price": 1,
 *		    "url": "www.fasil.com",
 *		    "title": "Facilo's Ad",
 *		    "address": "817 S Main St, Las Vegas, NV 89101",
 *		    "lat": null,
 *		    "lng": null,
 *		    "phone_no": "251911448404",
 *		    "ad_text": "Facilo's ad",
 *		    "ad_keyword_id": 191
 *		  },
 *		  {
 *		    "item_type_id": 1,
 *		    "keyword": "Elegant",
 *		    "activity_type_id": 1,
 *		    "actor_type_id": 4,
 *		    "item_id": 1018,
 *		    "actor_id": 409,
 *		    "activity_time": "2017-03-09T15:52:07.000Z",
 *		    "ip_address": "::ffff:172.31.17.91",
 *		    "user_agent": "Other 0.0.0 / Other 0.0.0",
 *		    "device_version": "Other 0.0.0",
 *		    "ad_id": 144,
 *		    "keyword_id": 2862,
 *		    "keyword_category_id": 8,
 *		    "ad_location_id": 156,
 *		    "ad_subpage_id": 1,
 *		    "price": 1,
 *		    "url": "www.fasil.com",
 *		    "title": "Facilo's Ad",
 *		    "address": "817 S Main St, Las Vegas, NV 89101",
 *		    "lat": null,
 *		    "lng": null,
 *		    "phone_no": "251911448404",
 *		    "ad_text": "Facilo's ad",
 *		    "ad_keyword_id": 191
 *		  }
 *		]
 */
router.get('/ads/:adId', function(req, res, next){
	var adId = req.params.adId;
	ppcModel.getAllAdAnalytics(adId).then(
		function(response){
			res.json(response);
		}, 
		function(error){
			next(error)
		}
	);
});


module.exports = router;