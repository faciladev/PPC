var Promise = require('bluebird');
var DbHelper = require('../lib/DbHelper');
var appError = require('../app_error');

var authorize = (req, res, next) => {
  let token = req.headers['authorization'] || 
  req.headers['Authorization'] ||
  req.cookies.Authorization || 
  req.cookies.authorization;
  
  if(token){
    DbHelper.getConnection().then(function(connection){
                
        connection.query(
            'SELECT * FROM ci_sessions ' +
            'WHERE id = ? AND user_id != 0', [token], 
            function (err, rows, fields) {

                //release connection
                connection.release();

                if(err){
                    return next(err);
                }

                if(rows.length > 0)
                	return next();
                else 
                	return res.json("Unauthorized access");
            }
        );
    }, function(error){
        reject(error);
    });
  } else {
  	res.json("Unauthorized access");
  }
}

module.exports = authorize;