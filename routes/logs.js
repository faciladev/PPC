var express = require('express');

const Joi = require('joi');
var jsonfile = require('jsonfile');

var logger = require('../logger');
var appError = require('../app_error');

var file = __dirname + '/../logs/log-email.json';

var router = express.Router();

//return logs of :days days including today
router.get('/', function(req, res, next){
    
    jsonfile.readFile(file, function(err, data){
        if(err){
            return next(err);
        } else{
            if(data.length > 0)
                data.reverse();

            res.json(data);
        }
    });
    // let days = req.query.days,
    //     type = req.query.type,
    //     field = req.query.field,
    //     limit = req.query.limit;
    // const schema = {
    //     days: Joi.number().integer().min(1).default(1),
    //     type: Joi.string(),
    //     field: Joi.string().default('message'),
    //     limit: Joi.number().integer().min(1).default(1000000)
    // };

    // Joi.validate(
    //     { days: days, type: type, limit: limit }, 
    //     schema, 
    //     function (err, value) {
    //         if(err)
    //             return next(err);

    //         var options = {
    //             from: new Date - parseInt(req.params.days) * 24 * 60 * 60 * 1000,    
    //             until: new Date,    
    //             start: 0,
    //             limit: limit,
    //             order: 'desc'
    //         };

    //         if(field)
    //             options.fields = [field];

    //         logger.query(options, function (err, results) {
    //             if(err)
    //                 return next(err);

    //             res.json(results.file);
    //         });
    //     }

    // );
 
            
});

module.exports = router;