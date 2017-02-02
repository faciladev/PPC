var Promise = require('promise');
var config = require('config');
var mime  = require('mime');


var UploadHelper = {
	//Can upload single or multiple files.
	uploadFiles: function(files, subDir){
		return new Promise(function(resolve, reject) {
			var fileNameKeys = Object.keys(files);
			var filesUploaded = [];
			var counter = 0;

			for(var i = 0; i<fileNameKeys.length; i++){
				(function(i){
					UploadHelper.uploadFile(files[fileNameKeys[i]], subDir).then(
						function(response){
							filesUploaded.push(response);
							if(i == fileNameKeys.length - 1)
								resolve(filesUploaded);
						},
						function(error){
							console.log(error);
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

			var fileName = Date.now() + '.' + mime.extension(file.mimetype);
			var fileSaveLocation = uploadDir + '/' + subDir + '/' + fileName;
			file.mv(fileSaveLocation, function(err) {

			    if (err) 
			      reject(err);

			  	resolve(fileName);
		  	});
		});
	}
}

module.exports = UploadHelper;