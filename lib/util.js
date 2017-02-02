var Promise = require('promise');
var requestIp = require('request-ip');
var userAgent = require('useragent');
var querystring = require('querystring');

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
                            reject(err);

                        if(rows.length <= 0)
                            reject(Error('User has no valid group'));
                        
                        resolve(rows[0]);
                        
                    }
                );
                
            },function(error){
                next(error);
            });
        });
    }, 

    getClientIp: function(req){
        return requestIp.getClientIp(req);
    },

    getUserAgent: function(){
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
    }



}

module.exports = Util;