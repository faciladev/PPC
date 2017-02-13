var Promise = require('promise');

var DbHelper = require('../lib/DbHelper');
var Util = require('../lib/util');

var userModel = {

    getUser: function(userId){
        return new Promise(function(resolve, reject) {
          
            DbHelper.getConnection().then(function(connection){
                
                connection.query(
                    'SELECT * FROM users WHERE id = ?', [userId], 
                    function (err, rows, fields) {
                        
                        //release connection
                        connection.release();

                        if(err){
                            return reject(err);
                        }

                        if(rows.length <= 0)
                            return reject(new Error('No user found.'));
                            
                        resolve(rows[0]);
                            
                    }
                );
            }, function(error){
                reject(error);
            });

            
        });
    },

    getUserGroup : function(userId){
        return new Promise(function(resolve, reject){
            DbHelper.getConnection().then(function(connection){
                console.log('z')
                connection.query('SELECT group_id FROM users_groups WHERE user_id = ?', 
                    [userId], 
                    function(err, rows, fields){
                        connection.release();

                        console.log(rows);
                        if(err)                            
                            return reject(err);

                        if(rows.length <= 0)
                            return reject(Error('User has no valid group'));
                        
                        conso
                        resolve(rows[0]);
                        
                    }
                );
                
            },function(error){
                reject(error);
            });
        });
    }, 
}

module.exports = userModel;