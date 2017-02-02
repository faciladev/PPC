var express = require('express');
var router = express.Router();
var ads = require('../models/ads');

//Ads GET requests
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
router.get('/ads/:id/locations', function(req, res, next) {
    ads.getAdLocations(req.params.id).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});
router.get('/ads/:id/microsite', function(req, res, next) {
    ads.getAdMicrosite(req.params.id).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});
router.get('/ads/:id/keywords', function(req, res, next) {
    ads.getAdKeywords(req.params.id).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});
router.get('/ads/:id/subpages', function(req, res, next) {
    ads.getAdSubpages(req.params.id).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});

//Gets category keywords
router.get('/ads/keywords/:categoryId', function(req, res, next) {
    ads.getCategoryKeywords(req.params.categoryId).then(function(response){
        res.json(response);
    }, function(error){
        error.message = 'Error';
        next(error);
    });
});

//Ads POST requests
router.post('/ads/', function(req, res, next) {
    ads.saveAd(req.body).then(function(response) {
            res.json(response);
        }, function(error) {
            error.message = 'Error';
            next(error);
        }
    );
});
router.post('/ads/:id/microsite', function(req, res, next) {
    var micrositeImage;
    if(!req.files){
        res.send('No files were uploaded');
        return;
    }
    //The name of the input file (i.e micrositeImageFile) is used to retrieve the uploaded image
    micrositeImage = req.files.micrositeImageFile;
    req.body.image = req.params.id + "_" + micrositeImage.name;
    ads.saveAdMicrosite(req.params.id, req.body).then(function(response){
        //use the mv() method to place the file somewhere on your server
        micrositeImage.mv('../PPC_ASSETS/microsite/' + req.params.id + "_" + micrositeImage.name, function(err) {
            if(err) {
                res.status(500).send(err);
            } else {
                res.json(response);
            }
        });
    }, function(error) {
        error.message = 'Error';
        next(error);
    });
});
router.post('/ads/:id/keywords', function(req, res, next) {
    console.log(req.body);
    ads.saveAdKeywords(req.params.id, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        error.message = 'Error';
        next(error);
    });
});
router.post('/ads/:id/subpages', function(req, res, next) {
    ads.saveAdSubPages(req.params.id, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        error.message = 'Error';
        next(error);
    });
});
router.post('/ads/:id/locations', function(req, res, next) {
    ads.saveAdLocations(req.params.id, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        error.message = 'Error';
        next(error);
    });
});

//Save keyword and keyword category
router.post('/ads/keywords/:categoryId', function(req, res, next) {
    ads.saveKeywords(req.params.categoryId, req.body).then(function(response){
        res.json(response);
    }, function(error) {
        error.message = 'Error';
        next(error);
    });
});

module.exports = router;
