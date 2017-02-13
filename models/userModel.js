var Promise = require('promise');

var DbHelper = require('../lib/DbHelper');
var Util = require('../lib/util');

const ACTOR_CONSUMER = 1;
const ACTOR_ADVERTISER = 2;
const ACTOR_NON_MEMBER = 3;
const ACTOR_ADMIN = 4;

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

    getActorType : function(group){
        var actor_type_id;
        if(group.group_id === 1){
            actor_type_id = ACTOR_ADMIN;
        }
        else if(group.group_id === 2){
            actor_type_id = ACTOR_CONSUMER;
        } else if(group.group_id === 3){
            actor_type_id = ACTOR_ADVERTISER;
        } else {
            actor_type_id = ACTOR_NON_MEMBER;
        }

        return actor_type_id;
    },

    getUserGroup : function(userId){
        return new Promise(function(resolve, reject){
            if(typeof userId === 'undefined' || userId === null)
                return resolve(false);

            DbHelper.getConnection().then(function(connection){
                connection.query('SELECT group_id FROM users_groups WHERE user_id = ?', 
                    [userId], 
                    function(err, rows, fields){
                        connection.release();

                        
                        if(err)                            
                            return reject(err);

                        if(rows.length <= 0)
                            return reject(new Error('User has no valid group'));
                        
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