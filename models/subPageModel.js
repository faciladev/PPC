var Promise = require('promise');

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
                            reject(err);
                        }


                        resolve(rows);
                    }
                );
            }, function(error){
                if(error)
                    reject(error);
            });

            
        });
    },
    //Gets all ad subpages
    getAdSubpages: function() {
        return new Promise(function(resolve, reject) {
            DbHelper.getConnection().then(function(connection) {
                connection.query('Select * from ppc_subpages',
                    function(err, rows, fields) {
                        connection.release();
                        if(err) {
                            reject(err);
                        }
                        resolve(rows);
                    }
                );
            }, function(error) {
                if(error)
                    reject(new Error('Connection error'));
            });
        });
    },
}

module.exports = subPageModel;