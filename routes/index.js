var express = require('express');
var router = express.Router();
var Index = require('../models/index');

/* GET home page. */
router.get('/', function(req, res, next) {
  Index.findAllTests().then(function(response){
        res.json(response);
    }, function(error){
    	error.message = 'Error';
        next(error);
    });
});

module.exports = router;
