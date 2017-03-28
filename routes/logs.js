var express = require('express');

const Joi = require('joi');
var jsonfile = require('jsonfile');
var config = require('config');

var logger = require('../logger');
var appError = require('../app_error');

var file = config.get('log_path') + '/log-email.json';

var router = express.Router();

//return logs of :days days including today
router.get('/', function(req, res, next){
	// if(x.length){
	// 	y=3;
	// }
    jsonfile.readFile(file, function(err, data){
        if(err){
            return next(err);
        } else{
            if(data.length > 0)
                data.reverse();

            res.json(data);
        }
    });
            
});

module.exports = router;