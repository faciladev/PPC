var express = require('express');
var router = express.Router();
var ppcModel = require('../models/ppcModel');
var userModel = require('../models/userModel');
var Util = require('../lib/util');

//Return analytics data for a sponsored ad
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