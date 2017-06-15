var express = require('express');
var config = require('config');
var cheerio = require('cheerio');
var request = require('request');

var router = express.Router();
var ppcModel = require('../models/ppcModel');
var Util = require('../lib/util');

var appError = require('../app_error');
/**
 * @api {get} /search/ads/:keyword/:location/:subPage Non-member Sponsored Ad Search
 * @apiVersion 0.1.0
 * @apiName NonMemberSponsoredAdSearch
 * @apiGroup Sponsored Ads
 *
 * @apiParam {String} keyword  Search keyword.
 * @apiParam {String} location  Search Location (city/zipcode).
 * @apiParam {Number} subPage  Subpage Id.
 *
 * @apiSuccess {Object[]} result List of matched sponsored ads.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *		  "result": [
 *		    {
 *		      "ad_keyword_id": 192,
 *		      "usa_state_code": "NV",
 *		      "usa_state_name": "Nevada",
 *		      "city": "Las Vegas",
 *		      "zipcode": "1234",
 *		      "ad_id": 144,
 *		      "url": "www.facilo.com",
 *		      "title": "Facilo's Ad",
 *		      "address": "817 S Main St, Las Vegas, NV 89101",
 *		      "lat": null,
 *		      "lng": null,
 *		      "phone_no": "251911448404",
 *		      "ad_text": "Facilo's ad",
 *		      "price": 10,
 *		      "keyword_category_id": 9,
 *		      "ad_location_id": 156,
 *		      "ad_subpage_id": 1,
 *		      "keyword_id": 10,
 *		      "redirectUrl": "http://ppc.l/api/click/ads/196/http%3A%2F%2Fiziphub.com%2FCategories%2Flisting_microsite%2F144"
 *		    }
 *		  ],
 *		  "page": 1,
 *		  "numRowsPerPage": 10,
 *		  "totalRows": 2,
 *		  "totalPages": 1
 *		}
 */
router.get('/ads/:keyword/:location/:subPage', function(req, res, next){
	searchAds(req, res, next);
});

/**
 * @api {get} /search/ads/:keyword/:location/:subPage/:userId Member Sponsored Ad Search
 * @apiVersion 0.1.0
 * @apiName MemberSponsoredAdSearch
 * @apiGroup Sponsored Ads
 *
 * @apiParam {String} keyword  Search keyword.
 * @apiParam {String} location  Search Location (city/zipcode).
 * @apiParam {Number} subPage  Subpage Id.
 * @apiParam {Number} userId  User Id.
 *
 * @apiSuccess {Object[]} result List of matched sponsored ads.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *		  "result": [
 *		    {
 *		      "ad_keyword_id": 192,
 *		      "usa_state_code": "NV",
 *		      "usa_state_name": "Nevada",
 *		      "city": "Las Vegas",
 *		      "zipcode": "1234",
 *		      "ad_id": 144,
 *		      "url": "www.facilo.com",
 *		      "title": "Facilo's Ad",
 *		      "address": "817 S Main St, Las Vegas, NV 89101",
 *		      "lat": null,
 *		      "lng": null,
 *		      "phone_no": "251911448404",
 *		      "ad_text": "Facilo's ad",
 *		      "price": 10,
 *		      "keyword_category_id": 9,
 *		      "ad_location_id": 156,
 *		      "ad_subpage_id": 1,
 *		      "keyword_id": 10,
 *		      "redirectUrl": "http://ppc.l/api/click/ads/196/http%3A%2F%2Fiziphub.com%2FCategories%2Flisting_microsite%2F144"
 *		    }
 *		  ],
 *		  "page": 1,
 *		  "numRowsPerPage": 10,
 *		  "totalRows": 2,
 *		  "totalPages": 1
 *		}
 */
router.get('/ads/:keyword/:location/:subPage/:userId', function(req, res, next) {
	searchAds(req, res, next);
});

/**
 * @api {get} /search/deals/:categoryId Search Deal By Category
 * @apiVersion 0.1.0
 * @apiName SearchDealByCategory
 * @apiGroup Daily Deals
 *
 * @apiParam {Number} categoryId  Daily Deal Category Id.
 *
 * @apiSuccess {Object[]} result List of Daily Deals in a Category.
 * @apiSuccess {Number} page  Pagination Page Number.
 * @apiSuccess {Number} numRowsPerPage  Pagination Number of Rows Per Page.
 * @apiSuccess {Number} totalPages  Pagination Total Pages.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *		  "result": [
 *		    {
 *		      "deal_id": 146,
 *		      "microsite_id": 165,
 *		      "company_name": null,
 *		      "what_you_get": "<ul>\n\t<li>50% off all perfumes</li>\n\t<li>Free Facial</li>\n</ul>\n",
 *		      "location": "10479 Brown Wolf St",
 *		      "end_date": "2017-03-29T21:00:00.000Z",
 *		      "start_date": "2017-03-07T21:00:00.000Z",
 *		      "discount_daily_description": "",
 *		      "discount_percentage": 0,
 *		      "discount_type": "text",
 *		      "name": "Discount Perfume",
 *		      "discount_price": null,
 *		      "image": "image_name",
 *		      "image_1": "image_name",
 *		      "image_2": "image_name",
 *		      "code": "embeddable_code",
 *		      "date_created": "2017-03-08T16:36:45.000Z",
 *		      "download_price": 6,
 *		      "discount_description": "50% off all perfumes",
 *		      "regular_price": 0,
 *		      "discount_rate": 0,
 *		      "coupon_name": "Discount Perfume",
 *		      "coupon_generated_code": "j016qgqq",
 *		      "is_approved": 1,
 *		      "is_deleted": 0,
 *		      "list_rank": 0,
 *		      "deal_image": "image_name",
 *		      "paused": 0,
 *		      "daily_deal_description": "<p>Discount Perfumes at our following locations:</p>\n\n<ul>\n\t<li>2820 S. Jones Blvd. Las Vegas NV 89146</li>\n\t<li>817 S. Main St. Las Vegas NV 89101</li>\n</ul>\n",
 *		      "approved_category_id": 3,
 *		      "url": "http://ppc.l/api/click/deals/146/http%3A%2F%2Fiziphub.com%2FCategories%2Fdaily_deals_microsite%2F146"
 *		    }
 *		  ],
 *		  "page": 1,
 *		  "numRowsPerPage": 10,
 *		  "totalRows": 2,
 *		  "totalPages": 1
 *		}
 */
router.get(/^\/deals\/(\d+)$/, function(req, res, next) {
	let location = req.query.location;
	if(location) searchDeals(req, res, next);
	else {
		const ip = Util.getClientIp(req);
		const ipAddress = Util.ipToLocation(ip);
		if(ipAddress.country && ipAddress.country === 'US'){
			req.query.location = ipAddress.zip;
		} else {
            return res.json({status: false, message: 'Location not in the USA'});
        }

		searchDeals(req, res, next);
	}
});

/**
 * @api {get} /search/deals/:keyword Search Deal By Keyword
 * @apiVersion 0.1.0
 * @apiName SearchDealByKeyword
 * @apiGroup Daily Deals
 *
 * @apiParam {String} keyword  Daily Deal Keyword.
 *
 * @apiSuccess {Object[]} result List of Daily Deals in a Category.
 * @apiSuccess {Number} page  Pagination Page Number.
 * @apiSuccess {Number} numRowsPerPage  Pagination Number of Rows Per Page.
 * @apiSuccess {Number} totalPages  Pagination Total Pages.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *		  "result": [
 *		    {
 *		      "deal_id": 146,
 *		      "microsite_id": 165,
 *		      "company_name": null,
 *		      "what_you_get": "<ul>\n\t<li>50% off all perfumes</li>\n\t<li>Free Facial</li>\n</ul>\n",
 *		      "location": "10479 Brown Wolf St",
 *		      "end_date": "2017-03-29T21:00:00.000Z",
 *		      "start_date": "2017-03-07T21:00:00.000Z",
 *		      "discount_daily_description": "",
 *		      "discount_percentage": 0,
 *		      "discount_type": "text",
 *		      "name": "Discount Perfume",
 *		      "discount_price": null,
 *		      "image": "image_name",
 *		      "image_1": "image_name",
 *		      "image_2": "image_name",
 *		      "code": "embeddable_code",
 *		      "date_created": "2017-03-08T16:36:45.000Z",
 *		      "download_price": 6,
 *		      "discount_description": "50% off all perfumes",
 *		      "regular_price": 0,
 *		      "discount_rate": 0,
 *		      "coupon_name": "Discount Perfume",
 *		      "coupon_generated_code": "j016qgqq",
 *		      "is_approved": 1,
 *		      "is_deleted": 0,
 *		      "list_rank": 0,
 *		      "deal_image": "image_name",
 *		      "paused": 0,
 *		      "daily_deal_description": "<p>Discount Perfumes at our following locations:</p>\n\n<ul>\n\t<li>2820 S. Jones Blvd. Las Vegas NV 89146</li>\n\t<li>817 S. Main St. Las Vegas NV 89101</li>\n</ul>\n",
 *		      "approved_category_id": 3,
 *		      "url": "http://ppc.l/api/click/deals/146/http%3A%2F%2Fiziphub.com%2FCategories%2Fdaily_deals_microsite%2F146"
 *		    }
 *		  ],
 *		  "page": 1,
 *		  "numRowsPerPage": 10,
 *		  "totalRows": 2,
 *		  "totalPages": 1
 *		}
 */
router.get('/deals/:keyword', function(req, res, next) {
	searchDeals(req, res, next);
});

/**
 * @api {get} /search/deals/nearest/:lat/:lng/:radius Search Deal By User Location
 * @apiVersion 0.1.0
 * @apiName SearchDealByUserLocation
 * @apiGroup Daily Deals
 *
 * @apiParam {Number} lat User Latitude.
 * @apiParam {Number} lng User Longitude.
 * @apiParam {Number} radius Radius.
 *
 * @apiSuccess {Object[]} result List of Daily Deals in a Category.
 * @apiSuccess {Number} page  Pagination Page Number.
 * @apiSuccess {Number} numRowsPerPage  Pagination Number of Rows Per Page.
 * @apiSuccess {Number} totalPages  Pagination Total Pages.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *		  "result": [
 *		    {
 *		      "deal_id": 146,
 *		      "microsite_id": 165,
 *		      "company_name": null,
 *		      "what_you_get": "<ul>\n\t<li>50% off all perfumes</li>\n\t<li>Free Facial</li>\n</ul>\n",
 *		      "location": "10479 Brown Wolf St",
 *		      "end_date": "2017-03-29T21:00:00.000Z",
 *		      "start_date": "2017-03-07T21:00:00.000Z",
 *		      "discount_daily_description": "",
 *		      "discount_percentage": 0,
 *		      "discount_type": "text",
 *		      "name": "Discount Perfume",
 *		      "discount_price": null,
 *		      "image": "image_name",
 *		      "image_1": "image_name",
 *		      "image_2": "image_name",
 *		      "code": "embeddable_code",
 *		      "date_created": "2017-03-08T16:36:45.000Z",
 *		      "download_price": 6,
 *		      "discount_description": "50% off all perfumes",
 *		      "regular_price": 0,
 *		      "discount_rate": 0,
 *		      "coupon_name": "Discount Perfume",
 *		      "coupon_generated_code": "j016qgqq",
 *		      "is_approved": 1,
 *		      "is_deleted": 0,
 *		      "list_rank": 0,
 *		      "deal_image": "image_name",
 *		      "paused": 0,
 *		      "daily_deal_description": "<p>Discount Perfumes at our following locations:</p>\n\n<ul>\n\t<li>2820 S. Jones Blvd. Las Vegas NV 89146</li>\n\t<li>817 S. Main St. Las Vegas NV 89101</li>\n</ul>\n",
 *		      "approved_category_id": 3,
 *		      "url": "http://ppc.l/api/click/deals/146/http%3A%2F%2Fiziphub.com%2FCategories%2Fdaily_deals_microsite%2F146"
 *		    }
 *		  ],
 *		  "page": 1,
 *		  "numRowsPerPage": 10,
 *		  "totalRows": 2,
 *		  "totalPages": 1
 *		}
 */
router.get('/deals/nearest/:lat/:lng/:radius', function(req, res, next) {
	fetchNearestDeals(req, res, next);
});

/**
 * @api {get} /search/deals/nearest/:lat/:lng/:radius/:userId Search Deal By User Location for Members
 * @apiVersion 0.1.0
 * @apiName MemberSearchDealByUserLocation
 * @apiGroup Daily Deals
 *
 * @apiParam {Number} lat User Latitude.
 * @apiParam {Number} lng User Longitude.
 * @apiParam {Number} radius Radius.
 * @apiParam {Number} userId User Id.
 *
 * @apiSuccess {Object[]} result List of Daily Deals in a Category.
 * @apiSuccess {Number} page  Pagination Page Number.
 * @apiSuccess {Number} numRowsPerPage  Pagination Number of Rows Per Page.
 * @apiSuccess {Number} totalPages  Pagination Total Pages.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *		  "result": [
 *		    {
 *		      "deal_id": 146,
 *		      "microsite_id": 165,
 *		      "company_name": null,
 *		      "what_you_get": "<ul>\n\t<li>50% off all perfumes</li>\n\t<li>Free Facial</li>\n</ul>\n",
 *		      "location": "10479 Brown Wolf St",
 *		      "end_date": "2017-03-29T21:00:00.000Z",
 *		      "start_date": "2017-03-07T21:00:00.000Z",
 *		      "discount_daily_description": "",
 *		      "discount_percentage": 0,
 *		      "discount_type": "text",
 *		      "name": "Discount Perfume",
 *		      "discount_price": null,
 *		      "image": "image_name",
 *		      "image_1": "image_name",
 *		      "image_2": "image_name",
 *		      "code": "embeddable_code",
 *		      "date_created": "2017-03-08T16:36:45.000Z",
 *		      "download_price": 6,
 *		      "discount_description": "50% off all perfumes",
 *		      "regular_price": 0,
 *		      "discount_rate": 0,
 *		      "coupon_name": "Discount Perfume",
 *		      "coupon_generated_code": "j016qgqq",
 *		      "is_approved": 1,
 *		      "is_deleted": 0,
 *		      "list_rank": 0,
 *		      "deal_image": "image_name",
 *		      "paused": 0,
 *		      "daily_deal_description": "<p>Discount Perfumes at our following locations:</p>\n\n<ul>\n\t<li>2820 S. Jones Blvd. Las Vegas NV 89146</li>\n\t<li>817 S. Main St. Las Vegas NV 89101</li>\n</ul>\n",
 *		      "approved_category_id": 3,
 *		      "url": "http://ppc.l/api/click/deals/146/http%3A%2F%2Fiziphub.com%2FCategories%2Fdaily_deals_microsite%2F146"
 *		    }
 *		  ],
 *		  "page": 1,
 *		  "numRowsPerPage": 10,
 *		  "totalRows": 2,
 *		  "totalPages": 1
 *		}
 */
router.get('/deals/nearest/:lat/:lng/:radius/:userId', function(req, res, next) {
	fetchNearestDeals(req, res, next);
});

/**
 * @api {get} /search/deals/:categoryId/:keyword Non-member Search Deal By Category and Keyword
 * @apiVersion 0.1.0
 * @apiName NonMemberSearchDealByCategoryAndKeyword
 * @apiGroup Daily Deals
 *
 * @apiParam {Number} categoryId  Daily Deal Category Id.
 * @apiParam {String} keyword  Search Keyword.
 *
 * @apiSuccess {Object[]} result List of Daily Deals in a Category.
 * @apiSuccess {Number} page  Pagination Page Number.
 * @apiSuccess {Number} numRowsPerPage  Pagination Number of Rows Per Page.
 * @apiSuccess {Number} totalPages  Pagination Total Pages.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *		  "result": [
 *		    {
 *		      "deal_id": 146,
 *		      "microsite_id": 165,
 *		      "company_name": null,
 *		      "what_you_get": "<ul>\n\t<li>50% off all perfumes</li>\n\t<li>Free Facial</li>\n</ul>\n",
 *		      "location": "10479 Brown Wolf St",
 *		      "end_date": "2017-03-29T21:00:00.000Z",
 *		      "start_date": "2017-03-07T21:00:00.000Z",
 *		      "discount_daily_description": "",
 *		      "discount_percentage": 0,
 *		      "discount_type": "text",
 *		      "name": "Discount Perfume",
 *		      "discount_price": null,
 *		      "image": "image_name",
 *		      "image_1": "image_name",
 *		      "image_2": "image_name",
 *		      "code": "embeddable_code",
 *		      "date_created": "2017-03-08T16:36:45.000Z",
 *		      "download_price": 6,
 *		      "discount_description": "50% off all perfumes",
 *		      "regular_price": 0,
 *		      "discount_rate": 0,
 *		      "coupon_name": "Discount Perfume",
 *		      "coupon_generated_code": "j016qgqq",
 *		      "is_approved": 1,
 *		      "is_deleted": 0,
 *		      "list_rank": 0,
 *		      "deal_image": "image_name",
 *		      "paused": 0,
 *		      "daily_deal_description": "<p>Discount Perfumes at our following locations:</p>\n\n<ul>\n\t<li>2820 S. Jones Blvd. Las Vegas NV 89146</li>\n\t<li>817 S. Main St. Las Vegas NV 89101</li>\n</ul>\n",
 *		      "approved_category_id": 3,
 *		      "url": "http://ppc.l/api/click/deals/146/http%3A%2F%2Fiziphub.com%2FCategories%2Fdaily_deals_microsite%2F146"
 *		    }
 *		  ],
 *		  "page": 1,
 *		  "numRowsPerPage": 10,
 *		  "totalRows": 2,
 *		  "totalPages": 1
 *		}
 */
router.get('/deals/:categoryId/:keyword', function(req, res, next){
	searchDeals(req, res, next);
});

/**
 * @api {get} /search/deals/:categoryId/:keyword/:userId Member Search Deal By Category and Keyword
 * @apiVersion 0.1.0
 * @apiName MemberSearchDealByCategoryAndKeyword
 * @apiGroup Daily Deals
 *
 * @apiParam {Number} categoryId  Daily Deal Category Id.
 * @apiParam {String} keyword  Search Keyword.
 * @apiParam {Number} userId  User Id.
 *
 * @apiSuccess {Object[]} result List of Daily Deals in a Category.
 * @apiSuccess {Number} page  Pagination Page Number.
 * @apiSuccess {Number} numRowsPerPage  Pagination Number of Rows Per Page.
 * @apiSuccess {Number} totalPages  Pagination Total Pages.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *		  "result": [
 *		    {
 *		      "deal_id": 146,
 *		      "microsite_id": 165,
 *		      "company_name": null,
 *		      "what_you_get": "<ul>\n\t<li>50% off all perfumes</li>\n\t<li>Free Facial</li>\n</ul>\n",
 *		      "location": "10479 Brown Wolf St",
 *		      "end_date": "2017-03-29T21:00:00.000Z",
 *		      "start_date": "2017-03-07T21:00:00.000Z",
 *		      "discount_daily_description": "",
 *		      "discount_percentage": 0,
 *		      "discount_type": "text",
 *		      "name": "Discount Perfume",
 *		      "discount_price": null,
 *		      "image": "image_name",
 *		      "image_1": "image_name",
 *		      "image_2": "image_name",
 *		      "code": "embeddable_code",
 *		      "date_created": "2017-03-08T16:36:45.000Z",
 *		      "download_price": 6,
 *		      "discount_description": "50% off all perfumes",
 *		      "regular_price": 0,
 *		      "discount_rate": 0,
 *		      "coupon_name": "Discount Perfume",
 *		      "coupon_generated_code": "j016qgqq",
 *		      "is_approved": 1,
 *		      "is_deleted": 0,
 *		      "list_rank": 0,
 *		      "deal_image": "image_name",
 *		      "paused": 0,
 *		      "daily_deal_description": "<p>Discount Perfumes at our following locations:</p>\n\n<ul>\n\t<li>2820 S. Jones Blvd. Las Vegas NV 89146</li>\n\t<li>817 S. Main St. Las Vegas NV 89101</li>\n</ul>\n",
 *		      "approved_category_id": 3,
 *		      "url": "http://ppc.l/api/click/deals/146/http%3A%2F%2Fiziphub.com%2FCategories%2Fdaily_deals_microsite%2F146"
 *		    }
 *		  ],
 *		  "page": 1,
 *		  "numRowsPerPage": 10,
 *		  "totalRows": 2,
 *		  "totalPages": 1
 *		}
 */
router.get('/deals/:categoryId/:keyword/:userId', function(req, res, next){
	searchDeals(req, res, next);
});

/**
 * @api {get} /search/deals?limit=:limit Get Deals from Each Category
 * @apiVersion 0.1.0
 * @apiName GetDealsFromEachCategory
 * @apiGroup Daily Deals
 *
 * @apiParam {Number} limit  Number of Deals From Each Category.
 *
 * @apiSuccess {Object[]} deals List of Daily Deals From Each Category.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *		  {
 *		    "deal_id": 146,
 *		    "microsite_id": 165,
 *		    "company_name": null,
 *		    "what_you_get": "<ul>\n\t<li>50% off all perfumes</li>\n\t<li>Free Facial</li>\n</ul>\n",
 *		    "location": "10479 Brown Wolf St",
 *		    "end_date": "2017-03-30T00:00:00.000Z",
 *		    "start_date": "2017-03-08T00:00:00.000Z",
 *		    "discount_daily_description": "",
 *		    "discount_percentage": 0,
 *		    "discount_type": "text",
 *		    "name": "Discount Perfume",
 *		    "discount_price": null,
 *		    "image": "image",
 *		    "image_1": "image",
 *		    "image_2": "image",
 *		    "code": "embeddable/code",
 *		    "date_created": "2017-03-08T16:36:45.000Z",
 *		    "download_price": 6,
 *		    "discount_description": "50% off all perfumes",
 *		    "regular_price": 0,
 *		    "discount_rate": 0,
 *		    "coupon_name": "Discount Perfume",
 *		    "coupon_generated_code": "j016qgqq",
 *		    "is_approved": 1,
 *		    "is_deleted": 0,
 *		    "list_rank": 0,
 *		    "deal_image": "",
 *		    "daily_deal_description": "<p>Discount Perfumes at our following locations:</p>\n\n<ul>\n\t<li>2820 S. Jones Blvd. Las Vegas NV 89146</li>\n\t<li>817 S. Main St. Las Vegas NV 89101</li>\n</ul>\n",
 *		    "approved_category_id": 3,
 *		    "url": "http://ppc.l/api/click/deals/146/http%3A%2F%2Fiziphub.com%2FCategories%2Fdaily_deals_microsite%2F146"
 *		  },
 *		  {
 *		    "deal_id": 151,
 *		    "microsite_id": 171,
 *		    "company_name": "company name",
 *		    "what_you_get": "what you get",
 *		    "location": "location",
 *		    "end_date": "2017-04-04T00:00:00.000Z",
 *		    "start_date": "2017-03-03T00:00:00.000Z",
 *		    "discount_daily_description": "discount description",
 *		    "discount_percentage": 15,
 *		    "discount_type": "numeric",
 *		    "name": "Deal name",
 *		    "discount_price": null,
 *		    "image": "image_name",
 *		    "image_1": "image_1",
 *		    "image_2": "image_2",
 *		    "code": "CODE",
 *		    "date_created": "2017-03-23T21:15:30.000Z",
 *		    "download_price": 20,
 *		    "discount_description": "discount description",
 *		    "regular_price": 50,
 *		    "discount_rate": null,
 *		    "coupon_name": "coupon name",
 *		    "coupon_generated_code": "CODE",
 *		    "is_approved": 1,
 *		    "is_deleted": 0,
 *		    "list_rank": 0,
 *		    "deal_image": "deal_image_name",
 *		    "daily_deal_description": "daily deal description",
 *		    "approved_category_id": 3,
 *		    "url": "http://ppc.l/api/click/deals/151/http%3A%2F%2Fiziphub.com%2FCategories%2Fdaily_deals_microsite%2F151"
 *		  }
 *		]
 */
router.get('/deals', function(req, res, next) {
	var limit = req.query.limit;
	if(typeof limit === 'undefined' || limit === null)
		limit = config.get('numRowsPerPage');

	let location = req.query.location;
	if( ! location) 
	{
		const ip = Util.getClientIp(req);
		const ipAddress = Util.ipToLocation(ip);
		if(ipAddress.country && ipAddress.country === 'US'){
			location = ipAddress.zip;
		} else {
            return res.json({status: false, message: 'Location not in the USA'});
        }
	}

	ppcModel.getDealsFromEachCategory(limit, location).then(
		function(deals){
			res.json(deals);
		}, 
		function(error){
			next(error);
		}
	)
});

/**
 * @api {get} /search/flexoffers/:subpageId Get Flex Offers By Subpage Id
 * @apiVersion 0.1.0
 * @apiName GetFlexOffersBySubpageId
 * @apiGroup Flex Offers
 *
 * @apiParam {Number} subpageId  Subpage Id.
 *
 * @apiSuccess {Object[]} flexoffers List of Flex Offers In a Subpage.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *		  {
 *		    "flexoffer_link_id": 36057,
 *		    "flexoffer_link_content": "embeddable/code",
 *		    "flexoffer_link_subpage_id": 1,
 *		    "flexoffer_link_featured": 0,
 *		    "flexoffer_list_order": 0,
 *		    "flexoffer_list_order_asc": 1000,
 *		    "flexoffer_name": "local offer",
 *		    "keyword_id": null,
 *		    "flexSrc": "image_src",
 *		    "flexLink": "image_link",
 *		    "url": "http://ppc.l/api/click/flexoffers/29807/http%3A%2F%2Fwww.tkqlhce.com%2Fclick-8072108-11757341-1430843951000%3Fcm_mmc%3DCJ-_-4746017-_-8072108-_-KA%2520-%2520Cirque%2520du%2520Soleil%2520Special%2520Offer%253a%2520Save%2520%2430!"
 *		  },
 *		  {
 *		    "flexoffer_link_id": 36057,
 *		    "flexoffer_link_content": "embeddable/code",
 *		    "flexoffer_link_subpage_id": 1,
 *		    "flexoffer_link_featured": 0,
 *		    "flexoffer_list_order": 0,
 *		    "flexoffer_list_order_asc": 1000,
 *		    "flexoffer_name": "local offer",
 *		    "keyword_id": null,
 *		    "flexSrc": "image_src",
 *		    "flexLink": "image_link",
 *		    "url": "http://ppc.l/api/click/flexoffers/29807/http%3A%2F%2Fwww.tkqlhce.com%2Fclick-8072108-11757341-1430843951000%3Fcm_mmc%3DCJ-_-4746017-_-8072108-_-KA%2520-%2520Cirque%2520du%2520Soleil%2520Special%2520Offer%253a%2520Save%2520%2430!"
 *		  }
 *		]
 */
router.get(/^\/flexoffers\/(\d+)$/,
    function(req, res, next) {
    	searchFlex(req, res, next);
    }
);

/**
 * @api {get} /search/flexoffers/:keyword Get Flex Offers By Keyword
 * @apiVersion 0.1.0
 * @apiName GetFlexOffersByKeyword
 * @apiGroup Flex Offers
 *
 * @apiParam {String} keyword  Search Keyword.
 *
 * @apiSuccess {Object[]} flexoffers List of Flex Offers that Matched Search Keyword.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *		  {
 *		    "flexoffer_link_id": 36057,
 *		    "flexoffer_link_content": "embeddable/code",
 *		    "flexoffer_link_subpage_id": 1,
 *		    "flexoffer_link_featured": 0,
 *		    "flexoffer_list_order": 0,
 *		    "flexoffer_list_order_asc": 1000,
 *		    "flexoffer_name": "local offer",
 *		    "keyword_id": null,
 *		    "flexSrc": "image_src",
 *		    "flexLink": "image_link",
 *		    "url": "http://ppc.l/api/click/flexoffers/29807/http%3A%2F%2Fwww.tkqlhce.com%2Fclick-8072108-11757341-1430843951000%3Fcm_mmc%3DCJ-_-4746017-_-8072108-_-KA%2520-%2520Cirque%2520du%2520Soleil%2520Special%2520Offer%253a%2520Save%2520%2430!"
 *		  },
 *		  {
 *		    "flexoffer_link_id": 36057,
 *		    "flexoffer_link_content": "embeddable/code",
 *		    "flexoffer_link_subpage_id": 1,
 *		    "flexoffer_link_featured": 0,
 *		    "flexoffer_list_order": 0,
 *		    "flexoffer_list_order_asc": 1000,
 *		    "flexoffer_name": "local offer",
 *		    "keyword_id": null,
 *		    "flexSrc": "image_src",
 *		    "flexLink": "image_link",
 *		    "url": "http://ppc.l/api/click/flexoffers/29807/http%3A%2F%2Fwww.tkqlhce.com%2Fclick-8072108-11757341-1430843951000%3Fcm_mmc%3DCJ-_-4746017-_-8072108-_-KA%2520-%2520Cirque%2520du%2520Soleil%2520Special%2520Offer%253a%2520Save%2520%2430!"
 *		  }
 *		]
 */
router.get('/flexoffers/:keyword',
    function(req, res, next) {
    	searchFlex(req, res, next);
    }
);

/**
 * @api {get} /search/flexoffers/:subpageId/:keyword Get Flex Offers By SubpageId and Keyword
 * @apiVersion 0.1.0
 * @apiName GetFlexOffersBySubpageIdAndKeyword
 * @apiGroup Flex Offers
 *
 * @apiParam {String} keyword  Search Keyword.
 * @apiParam {Number} subpageId  Subpage Id.
 *
 * @apiSuccess {Object[]} flexoffers List of Flex Offers that Matched the Search Keyword and Subpage Id.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *		  {
 *		    "flexoffer_link_id": 36057,
 *		    "flexoffer_link_content": "embeddable/code",
 *		    "flexoffer_link_subpage_id": 1,
 *		    "flexoffer_link_featured": 0,
 *		    "flexoffer_list_order": 0,
 *		    "flexoffer_list_order_asc": 1000,
 *		    "flexoffer_name": "local offer",
 *		    "keyword_id": null,
 *		    "flexSrc": "image_src",
 *		    "flexLink": "image_link",
 *		    "url": "http://ppc.l/api/click/flexoffers/29807/http%3A%2F%2Fwww.tkqlhce.com%2Fclick-8072108-11757341-1430843951000%3Fcm_mmc%3DCJ-_-4746017-_-8072108-_-KA%2520-%2520Cirque%2520du%2520Soleil%2520Special%2520Offer%253a%2520Save%2520%2430!"
 *		  },
 *		  {
 *		    "flexoffer_link_id": 36057,
 *		    "flexoffer_link_content": "embeddable/code",
 *		    "flexoffer_link_subpage_id": 1,
 *		    "flexoffer_link_featured": 0,
 *		    "flexoffer_list_order": 0,
 *		    "flexoffer_list_order_asc": 1000,
 *		    "flexoffer_name": "local offer",
 *		    "keyword_id": null,
 *		    "flexSrc": "image_src",
 *		    "flexLink": "image_link",
 *		    "url": "http://ppc.l/api/click/flexoffers/29807/http%3A%2F%2Fwww.tkqlhce.com%2Fclick-8072108-11757341-1430843951000%3Fcm_mmc%3DCJ-_-4746017-_-8072108-_-KA%2520-%2520Cirque%2520du%2520Soleil%2520Special%2520Offer%253a%2520Save%2520%2430!"
 *		  }
 *		]
 */
router.get('/flexoffers/:subpageId/:keyword',
    function(req, res, next) {
    	searchFlex(req, res, next);
    }
);

var searchFlex = function(req, res, next){

	var subpageId = (typeof req.params[0] === "undefined")
	? req.params.subpageId : req.params[0];
	var keyword = req.params.keyword;
	var page = req.query.page;
	var filter = req.query.filter;
	var letter = req.query.letter;

    ppcModel.findFlexOffers(subpageId, keyword, page, filter, letter).then(function(response){
        var paginatedSearchData = response;
        var flexoffers = (typeof response.result === "undefined") ? 
        					response : response.result;

        if(flexoffers.length <= 0)
        	return res.json(paginatedSearchData);

        //Remove multiple keyword match for one sponsored ad
		//aka removes duplicate sponsored ad results
        Util.removeObjDupInArr(flexoffers, "flexoffer_link_id").then(function(flexoffers){
        	//result with unique flexoffer_link_ids
        	paginatedSearchData = flexoffers;
        	ppcModel.saveFlexSearch(flexoffers).then(
				function(savedSearchIds){
					if(flexoffers.length === 1 && (savedSearchIds.affectedRows === 1)){
						//Matched one result
						
						let $ = cheerio.load(flexoffers[0].flexoffer_link_content);
						let link, redirectUrl, url;

						if($('a').attr('href')){
							link = $('a').attr('href');
							url = $('img').attr('src');
							redirectUrl = Util.sanitizeUrl(link);

							//Change http image source served through ppc ssl imageserver
							if(url && url.indexOf('http://') === 0){
								flexoffers[0].flexSrc = config.get('project_url') + '/api/imageserver/' + 
								Util.sanitizeUrl(url);
					        } else {
					        	flexoffers[0].flexSrc = url;
					        }
				                
			                flexoffers[0].flexLink = link;
			                flexoffers[0].url = config.get('project_url') + 
			                    '/api/click/flexoffers/' + savedSearchIds.insertId  + '/' +
			                    redirectUrl;

		                    return res.json(paginatedSearchData);

						} else if($('iframe').attr('src')) {
						    let iframeSrc = $('iframe').attr('src'); 
						    request('http:' + iframeSrc, function (error, response, body) {
							  if(response && response.statusCode === 200){
							  	let $iframe = cheerio.load(body);
							  	link = $iframe('area').eq(1).attr('href');
								url = $iframe('img').attr('src');
								redirectUrl = Util.sanitizeUrl(link);

								//Change http image source served through ppc ssl imageserver
								if(url && url.indexOf('http://') === 0){
									flexoffers[0].flexSrc = config.get('project_url') + '/api/imageserver/' + 
									Util.sanitizeUrl(url);
						        } else {
						        	flexoffers[0].flexSrc = url;
						        }
					                
				                flexoffers[0].flexLink = link;
				                flexoffers[0].url = config.get('project_url') + 
				                    '/api/click/flexoffers/' + savedSearchIds.insertId  + '/' +
				                    redirectUrl;
							  } 

							  return res.json(paginatedSearchData);
							});
							
						} else {
							return res.json(paginatedSearchData);
						}
						   
					}
					else if(flexoffers.length > 1 && (savedSearchIds.length === flexoffers.length)){
						//matched multiple results
						for(var i = 0; i<flexoffers.length; i++){
							let $ = cheerio.load(flexoffers[i].flexoffer_link_content);
							let link, redirectUrl, url;

							if($('a').attr('href')){
								link = $('a').attr('href');
								url = $('img').attr('src');
								redirectUrl = Util.sanitizeUrl(link);

				                //Change http image source served through ppc ssl imageserver
								if(url && url.indexOf('http://') === 0){
									flexoffers[i].flexSrc = config.get('project_url') + '/api/imageserver/' + 
									Util.sanitizeUrl(url);
						        } else {
						        	flexoffers[i].flexSrc = url;
						        }

				                flexoffers[i].flexLink = link;
				                flexoffers[i].url = config.get('project_url') + 
				                    '/api/click/flexoffers/' + savedSearchIds[i].insertId  + '/' +
				                    redirectUrl;

			                    if(i === flexoffers.length - 1)
			                    	return res.json(paginatedSearchData);

							} else if($('iframe').attr('src'))  {
								let iframeSrc = $('iframe').attr('src'); 
								let j = i; //Save current index locally
							    request('http:' + iframeSrc, function (error, response, body) {
							  		if(response && response.statusCode === 200){
									  	let $iframe = cheerio.load(body);
									  	link = $iframe('area').eq(1).attr('href');
										url = $iframe('img').attr('src');
										redirectUrl = Util.sanitizeUrl(link);

										//Change http image source served through ppc ssl imageserver
										if(url && url.indexOf('http://') === 0){
											flexoffers[j].flexSrc = config.get('project_url') + '/api/imageserver/' + 
											Util.sanitizeUrl(url);
								        } else {
								        	flexoffers[j].flexSrc = url;
								        }
							                
						                flexoffers[j].flexLink = link;
						                flexoffers[j].url = config.get('project_url') + 
						                    '/api/click/flexoffers/' + savedSearchIds.insertId  + '/' +
						                    redirectUrl;

						  			}

							  		if(j === flexoffers.length - 1)
			                    		return res.json(paginatedSearchData);
						  		});

								
							} else {

								if(i === flexoffers.length - 1)
			                    	return res.json(paginatedSearchData);
							}
	                    }
					}
					else {
						return next(new appError('Matched and saved search data inconsistent.'));
					}

					

				}, 

				function(error){
					return next(error);
				}
			);
        }, function(error){
        	next(error);
        })

    }, function(error){
        next(error);
    });
}

var searchAds = function(req, res, next){
	var keyword = req.params.keyword;
	var location = req.params.location;
	var subPage = req.params.subPage;
	var userId = req.params.userId;
	var filter = req.query.filter;
	var page = req.query.page;

	ppcModel.findSponsoredAds(keyword, location, subPage, page, filter).then(
		function(searchData){
			var paginatedSearchData = searchData;
			searchData = searchData.result;

			if(searchData.length <= 0)
				return res.json(paginatedSearchData);

			
			//Remove multiple keyword match for one sponsored ad
			//aka removes duplicate sponsored ad results
			Util.removeObjDupInArr(searchData, "ad_id").then(function(searchData){
				paginatedSearchData.result = searchData;
				//Save searches
				ppcModel.saveSponsoredAdSearch(searchData).then(
					function(savedSearchIds){
						
						if(searchData.length === 1 && (savedSearchIds.affectedRows === 1)){
							//matched one result
							searchData[0].search_id = savedSearchIds.insertId;
							var redirectUrl = Util.sanitizeUrl(config.get('web_portal_url') + '/' + 
		                            'Categories/listing_microsite/' + searchData[0].ad_id);
							searchData[0].redirectUrl = config.get('project_url') + 
		                        '/api/click/ads/' + savedSearchIds.insertId + '/' +
		                        redirectUrl
		                        ;
						}
						else if(searchData.length > 1 && (savedSearchIds.length === searchData.length)){
							//matched multiple results
							for(var i = 0; i<searchData.length; i++){
		                        var redirectUrl = Util.sanitizeUrl(config.get('web_portal_url') + '/' + 
		                            'Categories/listing_microsite/' + searchData[i].ad_id);

		                        searchData[i].redirectUrl = config.get('project_url') + 
		                        '/api/click/ads/' + savedSearchIds[i].insertId + '/' +
		                        redirectUrl
		                        ;
		                    }
						}
						else {
							next(new appError('Matched and saved search data inconsistent.'));
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
			}, function(error){
				next(error);
			});

			
			
		}, 
		function(error){			
			next(error);
		}
	)
}

var searchDeals = function(req, res, next) {
	var keyword = req.params.keyword;
	var categoryId = (typeof req.params[0] === "undefined")
	? req.params.categoryId : req.params[0];
	var userId = req.params.userId;
	var location = req.query.location;

	ppcModel.findDailyDeals(keyword, categoryId, req.query.page, location).then(
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

var fetchNearestDeals = function(req, res, next) {
	const lat = req.params.lat;
	const lng = req.params.lng;
	const radius = req.params.radius;
	var userId = req.params.userId;

	ppcModel.getNearestDeals(lat, lng, radius, req.query.limit).then(
		function(searchData){

			if(req.query.display === "count")
				return res.json(searchData.length);

			var userAgent = Util.getUserAgent(req);
			var ip = Util.getClientIp(req);

			if(searchData.length <= 0)
				return res.json([]);

			//Log impression
			ppcModel.trackDailyDealImpression(searchData, ip, userAgent, userId).then(
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