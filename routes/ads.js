var express = require('express');
var router = express.Router();
var ads = require('../models/ads');

router.get('/ads/', function(req, res, next) {
    ads.getAll().then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});

router.get('/ads/:id/', function(req, res, next) {
    ads.get(req.params.id).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});

router.get('/ads/:id/microsite', function(req, res, next) {
    ads.getMicrosite(req.params.id).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});

router.post('/ads/', function(req, res, next) {
    ads.saveAd(req.body).then(function(response) {
            res.json(response);
        }, function(error) {
            error.message = 'Error';
            next(error);
        }
    );
})

module.exports = router;
