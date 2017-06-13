var Promise = require('bluebird');
var requestIp = require('request-ip');
var userAgent = require('useragent');
var querystring = require('querystring');
var config = require('config');
var request = require('request');
var base64Img = require('base64-img');
var cities = require('cities');
var geoip = require('geoip-lite');

var DbHelper = require('./DbHelper');

var Util = {
    getUserGroup : function(userId){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(function(connection){

                connection.query('SELECT group_id FROM users_groups WHERE user_id = ?', 
                    [userId], 
                    function(err, rows, fields){
                        connection.release();

                        if(err)                            
                            return reject(err);

                        if(rows.length <= 0)
                            return reject(Error('User has no valid group'));
                        
                        resolve(rows[0]);
                        
                    }
                );
                
            },function(error){
                return reject(error);
            });
        });
    }, 

    toRad:  angle => {
      return angle * (Math.PI / 180);
    },

    //This function takes in latitude and longitude of two location 
    //and returns the distance between them in miles
    getDistanceBtnPoints: (lat1, lon1, lat2, lon2) => {

        if(isNaN(lat1) || isNaN(lat2) || isNaN(lon1) || isNaN(lon2))
            return false;

        var R = 3959; // mil
        var dLat = Util.toRad(lat2-lat1);
        var dLon = Util.toRad(lon2-lon1);
        var lat1 = Util.toRad(lat1);
        var lat2 = Util.toRad(lat2);

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c;
        return d;
    },

    getNearestSquareBoundary: (lat, lng, radius) => {
        
        const angleRadius = radius / 69; //Mile to degree 
        const minLat = lat - angleRadius;
        const maxLat = lat + angleRadius;
        const minLng = lng - angleRadius;
        const maxLng = lng + angleRadius;
        
        return {minLat, maxLat, minLng, maxLng};
        
        
    },

    getClientIp: function(req){
        return requestIp.getClientIp(req);
    },

    getUserAgent: function(req){
        var agent = userAgent.lookup(req.headers['user-agent'], req.query.jsuseragent);
        return {
            user_agent : agent.toString(),
            device_version: agent.device.toString()
        };
    },

    timeNow : function () {
        var myDate = new Date();
        return ((myDate.getHours() < 10)?"0":"") + myDate.getHours() +":"+ ((myDate.getMinutes() < 10)?"0":"") + myDate.getMinutes() +":"+ ((myDate.getSeconds() < 10)?"0":"") + myDate.getSeconds();
    },

    today : function () {
        var myDate = new Date();
        return myDate.getFullYear() + "-" + (((myDate.getMonth()+1) < 10)?"0":"") + (myDate.getMonth()+1) + "-" + ((myDate.getDate() < 10)?"0":"") + myDate.getDate();
    },

    firstDay : function(){
        var curr = new Date;
        var first = curr.getDate() - curr.getDay();
        return new Date(curr.setDate(first));
    },

    lastDay : function(){
        var curr = new Date;
        var first = curr.getDate() - curr.getDay();
        var last = first + 6;
        return new Date(curr.setDate(last));
    },

    sanitizeUrl : function (url) {
        if(url.indexOf('http://') == 0){
        }else if(url.indexOf('https://') == 0){
        }else{
            url = 'http://' + url;
        }
        return querystring.escape(url);
    },

    decodeUrl : function (url) {
        if(url.indexOf('http://') == 0){
        }else if(url.indexOf('https://') == 0){
        }else{
            url = 'http://' + url;
        }
        return querystring.unescape(url);
    },

    getAddressLatLng: function(address){
        return new Promise(function(resolve, reject){

            if(typeof address === "undefined" || address === null)
                return reject(false);

            var apiKey = config.get('google_map_api_key');
            var url = Util.decodeUrl('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + apiKey);
            var lat, lng;
            request(url,
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        if(typeof JSON.parse(body).results[0] !== 'undefined'){
                            lat = JSON.parse(body).results[0].geometry.location.lat;
                            lng = JSON.parse(body).results[0].geometry.location.lng;
                        }
                        resolve({lat: lat, lng: lng});

                    } else {
                        console.log(error);
                        resolve(false);
                    }
                }
            );
        });
    },

    removeObjDupInArr: function(arr, key_name) {
        return new Promise(function(resolve, reject){
            if(arr.constructor !== Array || arr.length === 0)
                return reject('Invalid Array.');

            return resolve(arr.reduce(
                function (p, c) {
                    var key = c[key_name];
                    if (p.temp.indexOf(key) === -1) {
                        p.out.push(c);
                        p.temp.push(key);
                    }
                    return p;
                }, 
                { temp: [], out: [] }
            ).out);
        });
            
    },

    imageUrl2Base64: function(url){
        return new Promise(function(resolve, reject){
            base64Img.requestBase64(url, function(err, res, body) {
              if(err) return reject(err);
              return resolve(body);
            });
        });
    },

    getLatLngCity: function(lat, lng){
        return cities.gps_lookup(lat, lng);
    },

    ipToLocation: function(ip){
        return geoip.lookup(ip);
    }



}

module.exports = Util;