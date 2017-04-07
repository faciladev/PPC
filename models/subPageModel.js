var Promise = require('bluebird');

var DbHelper = require('../lib/DbHelper');
var Util = require('../lib/util');

var subPageModel = {
    //Get all daily deal subpages
    getSubPages: function(){
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection){

                connection.query(
                    'SELECT * FROM sub_page', 
                    function (err, rows, fields) {

                        //release connection
                        connection.release();

                        if(err){
                            return reject(err);
                        }


                        resolve(rows);
                    }
                );
            }, function(error){
                return reject(error);
            });

            
        });
    },
    //Gets all ad subpages
    getAdSubpages: function() {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection) {
                connection.query('SELECT * FROM sub_page WHERE subpage_name=? OR subpage_name=? OR subpage_name=?',
                    ['Search by City & Zip Code','Food and Restaurants','Business to Business'],
                    function(err, rows, fields) {
                        connection.release();
                        if(err) {
                            reject(err);
                        }
                        resolve(rows);
                    }
                );
            }, function(error) {
                reject(error);
            });
        });
    },
}

module.exports = subPageModel;