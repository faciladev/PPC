var express = require('express');

var router = express.Router();

var offerModel = require('../models/offerModel');
var Util = require('../lib/util');

//router for all daily deal subpages
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