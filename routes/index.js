var express = require('express');

var router = express.Router();

var subPageModel = require('../models/subPageModel');
var usaStateModel = require('../models/usaStateModel');
var Util = require('../lib/util');

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


module.exports = router;