var Promise = require('promise');

var DbHelper = require('../lib/DbHelper');
var Util = require('../lib/util');


var flexModel = {

    getFlexLetters: function(filter, subPage){
        return new Promise(function(resolve, reject) {
            filter = filter || null;
            subPage = parseInt(subPage);
          
            DbHelper.getConnection().then(function(connection){

                var select = 'SELECT DISTINCT LOWER(LEFT(iziphub_flexoffer_link.flexoffer_name, 1)) '+
                'AS letter FROM iziphub_flexoffer_link ';
                var where = 'WHERE ';

                if(typeof filter === "string"){
                    switch(filter){
                        case 'featured':
                            where += 'iziphub_flexoffer_link.flexoffer_link_featured = 1 AND ';
                            break;
                        case 'all':
                            where += 'iziphub_flexoffer_link.flexoffer_link_featured = 0 AND ';
                            break;
                        default:
                            break;
                    }
                }

                if(! isNaN(subPage)){
                    where += 'iziphub_flexoffer_link.flexoffer_link_subpage_id = ' + 
                    parseInt(subPage) + ' AND ';
                }

                where += 'iziphub_flexoffer_link.flexoffer_name IS NOT NULL AND ' +
                'iziphub_flexoffer_link.flexoffer_name != "" ORDER BY letter';

                var query = select + where;

                connection.query(
                    query, 
                    function (err, rows, fields) {
                        
                        //release connection
                        connection.release();

                        if(err){
                            return reject(err);
                        }

                        var letters = [];

                        if(rows.length > 0){
                            for(var i = 0; i < rows.length; i++){
                                letters.push(rows[i]['letter']);
                            }

                            resolve(letters);
                        }

                        resolve([]);
                            
                    }
                );
            }, function(error){
                reject(error);
            });

            
        });
    }
}

module.exports = flexModel;