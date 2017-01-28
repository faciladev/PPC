var Promise = require('promise');

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
    }
}

module.exports = Util;


