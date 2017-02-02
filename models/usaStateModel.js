var Promise = require('promise');

var DbHelper = require('../lib/DbHelper');
var Util = require('../lib/util');

var usaStateModel = {

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
    }
}

module.exports = usaStateModel;