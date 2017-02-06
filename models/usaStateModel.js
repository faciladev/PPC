var Promise = require('promise');

var DbHelper = require('../lib/DbHelper');
var PaginationHelper = require('../lib/PaginationHelper');
var Util = require('../lib/util');

var usaStateModel = {

    getUsaStates: function(page){
        return new Promise(function(resolve, reject) {
            // var query = 'SELECT * FROM usa_states';
            // PaginationHelper.paginate(query, page).then(
            //     function(result){
            //         resolve(result);
            //     }, 
            //     function(error){
            //         reject(error);
            //     }
            // );
            DbHelper.getConnection().then(function(connection){

                connection.query(
                    'SELECT * FROM usa_states', 
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