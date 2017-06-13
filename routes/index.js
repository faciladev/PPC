var express = require('express');
var request = require('request');
const fileType = require('file-type');

var router = express.Router();

var subPageModel = require('../models/subPageModel');
var usaStateModel = require('../models/usaStateModel');
var advertiserModel = require('../models/advertiserModel');
var walletModel = require('../models/walletModel');
var businessModel = require('../models/businessModel');
var flexModel = require('../models/flexModel');
var ads = require('../models/ads');
var Util = require('../lib/util');

/**
 * @api {get} /subpages Get All Subpages
 * @apiVersion 0.1.0
 * @apiName GetAllSubpages
 * @apiGroup Miscellaneous
 *
 * @apiSuccess {Object[]} subpages  List of Subpages.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      [
 *          {
 *            "subpage_id": 1,
 *            "subpage_name": "Local"
 *          },
 *          {
 *            "subpage_id": 2,
 *            "subpage_name": "Web Retailers"
 *          },
 *          {
 *            "subpage_id": 3,
 *            "subpage_name": "Fashion Shoes"
 *          }
 *      ]
 */
router.get('/subpages', function(req, res, next){
	subPageModel.getSubPages().then(
		function(subPages){
			res.json(subPages);
		}, 
		function(error){
			next(error);
		}
	);
});

/**
 * @api {get} /adSubpages Get All Sponsored Ad Subpages
 * @apiVersion 0.1.0
 * @apiName GetAllSponsoredAdSubpages
 * @apiGroup Miscellaneous
 *
 * @apiSuccess {Object[]} adSubpages  List of Sponsored Ad Subpages.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      [
 *          {
 *            "subpage_id": 1,
 *            "subpage_name": "Local"
 *          },
 *          {
 *            "subpage_id": 6,
 *            "subpage_name": "Food and Restaurants"
 *          },
 *          {
 *            "subpage_id": 14,
 *            "subpage_name": "Business to Business"
 *          }
 *      ]
 */
router.get('/adSubpages', function(req, res, next) {
    subPageModel.getAdSubpages().then(function(response){
        res.json(response);
    }, function(error){
        next(error);
    });
});

/**
 * @api {get} /usastates Get All USA States
 * @apiVersion 0.1.0
 * @apiName GetAllUSAStates
 * @apiGroup Miscellaneous
 *
 * @apiSuccess {Object[]} usaStates  List of USA States.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      [
 *        {
 *            "usa_state_id": 1,
 *            "usa_state_code": "AL",
 *            "usa_state_name": "Alabama"
 *          },
 *          {
 *            "usa_state_id": 2,
 *            "usa_state_code": "AK",
 *            "usa_state_name": "Alaska"
 *          },
 *          {
 *            "usa_state_id": 3,
 *            "usa_state_code": "AZ",
 *            "usa_state_name": "Arizona"
 *          },
 *          {
 *            "usa_state_id": 4,
 *            "usa_state_code": "AR",
 *            "usa_state_name": "Arkansas"
 *          },
 *      ]
 */
router.get('/usastates', function(req, res, next){
	usaStateModel.getUsaStates().then(
		function(usaStates){
			res.json(usaStates);
		}, 
		function(error){
			next(error);
		}
	);
});

/**
 * @api {get} /categories Get All Sponsored Ad Keyword Categories
 * @apiVersion 0.1.0
 * @apiName GetAllKeywordCategories
 * @apiGroup Sponsored Ads
 *
 * @apiSuccess {Object[]} keywordCategories  List of Sponsored Ad Keyword Categories.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      [
 *        {
 *            "id": 6,
 *            "name": "Telecom",
 *            "is_deleted": 0
 *        },
 *        {
 *            "id": 7,
 *            "name": "Electronics",
 *            "is_deleted": 0
 *        },
 *        {
 *            "id": 8,
 *            "name": "MEN'S FASHION",
 *            "is_deleted": 0
 *        }
 *      ]
 */
router.get('/categories', function(req, res, next) {
    ads.getCategories().then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});

/**
 * @api {get} /wallets Count items in wallet
 * @apiVersion 0.1.0
 * @apiName CountItemsInWallet
 * @apiGroup Wallet
 *
 * @apiSuccess {Object[]} WalletItems  List of items in wallet.
 *
 */
router.get('/wallets/:userId', function(req, res, next) {
    walletModel.getAllItems(parseInt(req.params.userId)).then(function(response){
        if(req.query.display === 'count')
            return res.json(response.length);

        res.json(response);
    }, function(error){
        next(error);
    });
});

/**
 * @api {get} /keywords Get All Sponsored Ad Keywords
 * @apiVersion 0.1.0
 * @apiName GetAllKeywords
 * @apiGroup Sponsored Ads
 *
 * @apiSuccess {Object[]} keywords  List of Sponsored Ad Keyworda.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      [
 *        {
 *          "id": 10,
 *          "keyword": "telecommunication",
 *          "price": 10,
 *          "created_by": 164
 *        },
 *        {
 *          "id": 11,
 *          "keyword": "mobile phones",
 *          "price": 0.5,
 *          "created_by": 164
 *        },
 *        {
 *          "id": 12,
 *          "keyword": "new key",
 *          "price": 1,
 *          "created_by": 231
 *        }
 *      ]
 */
router.get('/keywords', function(req, res, next) {
    ads.getKeywords().then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});

/**
 * @api {get} /keywords Get Sponsored Ad Keyword
 * @apiVersion 0.1.0
 * @apiName GetKeyword
 * @apiGroup Sponsored Ads
 *
 * @apiSuccess {Object[]} keyword  Details of A Sponsored Ad Keyword.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      [
 *        {
 *          "id": 10,
 *          "keyword": "telecommunication",
 *          "price": 10,
 *          "created_by": 164
 *        }
 *      ]
 */
router.get('/keywords/:id', function(req, res, next) {
    ads.getKeyword(req.params.id).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});

/**
 * @api {get} /advertisers Get All Advertisers
 * @apiVersion 0.1.0
 * @apiName GetAllAdvertisers
 * @apiGroup Miscellaneous
 *
 * @apiSuccess {Object[]} advertisers  List of Advertisers.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      [
 *        {
 *            "advertizer_id": 1,
 *            "advertizer_business_name": "PurchasePerfume.com",
 *            "advertizer_phone_number": "7022035309",
 *            "advertizer_contact_person": "",
 *            "advertizer_title": "",
 *            "advertizer_billing_address1": "10479 Brown Wolf St",
 *            "advertizer_billing_address2": "",
 *            "advertizer_profile_picture": 0,
 *            "advertizer_city": "Las Vegas",
 *            "advertizer_state": 29,
 *            "advertizer_zipcode": "89178",
 *            "advertizer_nearby_locations": "",
 *            "advertizer_domain_name": "purchaseperfume.com",
 *            "advertizer_user_id": 145,
 *            "advertizer_approved": "1",
 *            "advertizer_referer": 1,
 *            "ziphub_referrer": 59,
 *            "advertizer_deleted": 0,
 *            "advertizer_created_on": "2016-06-06T10:06:12.000Z",
 *            "advertizer_ethnicity": 0,
 *            "advertizer_sex": "",
 *            "advertizer_status": 4
 *          }
 *          
 *      ]
 */
router.get('/advertisers', function(req, res, next){
	advertiserModel.getAdvertisers().then(
		function(advertisers){
			res.json(advertisers);
		}, 
		function(error){
			next(error);
		}
	);
});

/**
 * @api {get} /advertisers/:advertiserId Get An Advertiser
 * @apiVersion 0.1.0
 * @apiName GetAnAdvertiser
 * @apiGroup Miscellaneous
 *
 * @apiSuccess {Object} advertiser  Details of an Advertiser.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "advertizer_id": 1,
 *         "advertizer_business_name": "PurchasePerfume.com",
 *         "advertizer_phone_number": "7022035309",
 *         "advertizer_contact_person": "",
 *         "advertizer_title": "",
 *         "advertizer_billing_address1": "10479 Brown Wolf St",
 *         "advertizer_billing_address2": "",
 *         "advertizer_profile_picture": 0,
 *         "advertizer_city": "Las Vegas",
 *         "advertizer_state": 29,
 *         "advertizer_zipcode": "89178",
 *         "advertizer_nearby_locations": "",
 *         "advertizer_domain_name": "purchaseperfume.com",
 *         "advertizer_user_id": 145,
 *         "advertizer_approved": "1",
 *         "advertizer_referer": 1,
 *         "ziphub_referrer": 59,
 *         "advertizer_deleted": 0,
 *         "advertizer_created_on": "2016-06-06T10:06:12.000Z",
 *         "advertizer_ethnicity": 0,
 *         "advertizer_sex": "",
 *         "advertizer_status": 4
 *      }
 *       
 */
router.get('/advertisers/:advertiserId', function(req, res, next){
    var advertiserId = req.params.advertiserId;
    advertiserModel.getOneAdvertiser(advertiserId).then(
        function(advertiser){
            res.json(advertiser);
        }, 
        function(error){
            next(error);
        }
    );
});

/**
 * @api {get} /businesses/advertisers/:advertiserId Get Advertiser's Business
 * @apiVersion 0.1.0
 * @apiName GetAnAdvertiserBusiness
 * @apiGroup Miscellaneous
 *
 * @apiSuccess {Object[]} businesses Business information of an advertiser.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "id": 17,
 *        "advertiser_id": 753,
 *        "advertiser_user_id": 1904,
 *        "business_type_id": 1,
 *        "name": "hjf",
 *        "address": "jhf",
 *        "city": "hjdhf",
 *        "state": 1,
 *        "zip_code": "979",
 *        "email": "mdnf@jfgkjg.com",
 *        "website_url": "jfgkjg",
 *        "phone_number": "989",
 *        "weekdays_start": "Mon",
 *        "weekdays_end": "Mon",
 *        "weekdays_start_time": 8,
 *        "weekdays_end_time": 4,
 *        "weekend_start": "Mon",
 *        "weekend_end": "",
 *        "weekend_start_time": 8,
 *        "weekend_end_time": 4,
 *        "summary": "fjghkjhg                         ",
 *        "created_on": "2017-03-14T14:48:11.000Z"
 *    }
 *       
 */
router.get('/businesses/advertisers/:advertiserId', function(req, res, next){
    var advertiserId = req.params.advertiserId;
    businessModel.getByAdvertisers(advertiserId).then(
        function(businesses){
            res.json(businesses);
        }, 
        function(error){
            next(error);
        }
    );
});


router.post('/categories', function(req, res, next) {
    ads.saveCategory(req.body).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});
router.post('/keywords', function(req, res, next) {
    ads.saveKeyword(req.body).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});

router.post('/categoryKeywords', function(req, res, next) {
    ads.saveCategoryKeywords(req.body).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});

/**
 * @api {get} /flexoffers/letters Get Unique Initials of Flex Offer Names For Letter Pagination
 * @apiVersion 0.1.0
 * @apiName GetFlexOfferLetters
 * @apiGroup Flex Offers
 *
 * @apiSuccess {Object[]} letters Listing of Letters
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       "a",
 *       "b",
 *       "c",
 *       "d",
 *       "f",
 *       "l",
 *       "m",
 *       "n",
 *       "o",
 *       "s",
 *       "t",
 *       "v",
 *       "w"
 *     ]
 *       
 */
router.get('/flexoffers/letters', function(req, res, next) {
    var filter = req.query.filter;
    var subPage = req.query.subpage;
    
    flexModel.getFlexLetters(filter, subPage).then(function(response){
        res.json(response);
    }, function(error){
        next(error);
    });
});

router.get('/latlngaddress/:lat/:lng', function(req, res, next) {
    var filter = req.query.filter;
    var subPage = req.query.subpage;
    var address = Util.getLatLngCity(req.params.lat, req.params.lng);
    if(address) return res.json(address);
    else return res.json('Unsupported parameters');
});

router.get('/iplocation', (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(ip);
    res.json(Util.ipToLocation(ip));
});

router.get('/imageserver/:url', (req, res, next) => {
    var requestSettings = {
        url: Util.decodeUrl(req.params.url),
        method: 'GET',
        encoding: null
    };

    let mime;

    request(requestSettings, (error, response, body) => {
        if(error){
            res.status(400).json(error);
        } else {
            
            res.set('Content-Type', mime);
            res.send(body);
        }
            
    }).on('data', data => {
        //Detect filetype from buffer
        var ImageObj = fileType(data);

        if(ImageObj){
            mime = ImageObj.mime;
        }

    });

});

module.exports = router;