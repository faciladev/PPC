var Promise = require('promise');
var config = require('config');
var DbHelper = require('./DbHelper');


var PaginationHelper = {

	/**
	Parameters
	1) query (without limit clause)
	2) page (optional to view the first view)
	3) numRowsPerPage (optional, read from config if not provided.)


	Return object fields
	1) result
	2) page
	3) numRowsPerPage
	4) totalRows
	5) totalPages

	**/
	paginate: function(query, page, numRowsPerPage, params){
        
		return new Promise(function(resolve, reject) {
			
			var totalRows;

			//check if page is passed
			page = parseInt(page) || 1;

			//Check if numRowsPerPage is passed.
			numRowsPerPage = (typeof numRowsPerPage === 'undefined' || numRowsPerPage === null) ? 
				config.get('numRowsPerPage') : parseInt(numRowsPerPage);

            params = (typeof params === 'undefined' || params === null) ? null : params;

			DbHelper.getConnection().then(function(connection){
                connection.query(query,
                    params,
                    function (err, rows, fields) {
                        
                        if(err){
                        	connection.release();
                            return reject(err);
                        }

                        totalRows = rows.length;
                        var lastPage = Math.ceil(totalRows/numRowsPerPage);

                        if(page > lastPage)
                        	page = lastPage;
                        if(page < 1)
                        	page = 1;

                        var offset = (page - 1) * numRowsPerPage;

                        query += ' LIMIT ' + offset + ', ' + numRowsPerPage;

                        connection.query(query, 
                            params,
                        	function(err, rows, fields){
                        		connection.release();
                        		resolve({
                        			result : rows,
                        			page : page,
                        			numRowsPerPage: numRowsPerPage,
                        			totalRows: totalRows,
                        			totalPages: lastPage
                        		});
                        	}, 
                        	function(error){
                        		connection.release();
                        		reject(error);
                        	}
                        )

                    }
                );
            }, function(error){
            	reject(error);
            });

		});
	}
}

module.exports = PaginationHelper;