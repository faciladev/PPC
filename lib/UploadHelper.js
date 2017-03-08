var Promise = require('promise');
var config = require('config');
var mime  = require('mime');


var UploadHelper = {
	//Can upload single or multiple files.
	uploadFiles: function(files, subDir){
		return new Promise(function(resolve, reject) {
			var fileNameKeys = Object.keys(files);
			var filesUploaded = [];

			for(var i = 0; i<fileNameKeys.length; i++){
				(function(i){
					UploadHelper.uploadFile(files[fileNameKeys[i]], subDir).then(
						function(response){
							filesUploaded.push(response);
							if(i == fileNameKeys.length - 1)
								return resolve(filesUploaded);
						},
						function(error){
							return reject(error);
						}
					);
				})(i);
			}
			
			
		});
	}, 

	//Uploads a single file
	uploadFile: function(file, subDir){

		return new Promise(function(resolve, reject) {
			var uploadDir = config.get('upload_path');	
			var randNumber = Math.floor((Math.random() * 1000000) + 1);
			var fileName = Date.now() + '' + randNumber + '.' + mime.extension(file.mimetype);

			var fileSaveLocation = uploadDir + '/' + subDir + '/' + fileName;
			file.mv(fileSaveLocation, function(err) {

			    if (err) 
			      return reject(err);

			  	resolve(fileName);
		  	});
		});
	}
}

module.exports = UploadHelper;