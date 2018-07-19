"use strict"

var request = require("request")
// var tracing = require(__base+'/tools/traces/trace.js');
var path = require('path');
var fs = require('fs');
var error = null;

var upload = function (lbConnector, xmlString, rawModel, incomingModel, modelName, cb) {
  console.log("Initiating distributed file storage...");
  // store all uploads in the /uploads directory
  var uploadDir = path.join(__dirname, '/uploads');
  var model = {
    xmlString: xmlString,
    rawModel,
    standardModel: incomingModel,
    modelName
  };

  if(fs.existsSync(uploadDir)){
    var files = [];
    fs.readdir(uploadDir, function(err,list){
        if(err) console.log(err);
        for(var i=0; i<list.length; i++){
          console.log(list[i]);
          fs.unlinkSync(path.join(uploadDir, list[i]));
        }
    });
  } else {
      fs.mkdirSync(uploadDir);
  }

  fs.writeFile(uploadDir + '/model.json', JSON.stringify(model), function (err, data) {
    if (err) {
      console.log('error: ' + err);
      error = err;
      cb(error);
    }
    console.log("model json file stored");
    var options = 	{
    	url: lbConnector.settings.ipfs_api_ip+':'+lbConnector.settings.ipfs_api_port+'/api/v0/add',
    	method: "POST",
    	formData: {file:fs.createReadStream(path.join(uploadDir, '/model.json'))},
    	json: true
    };

  	request(options, function(error, response, body) {
  		console.log("Accessing URL : " + options.url);

  		if (response != undefined && response.statusCode == 200 && !body.hasOwnProperty("error")) {
  			console.log("response: ", body);
        //res.end(JSON.stringify({status: 'success', "fileName":  lbConnector.settings.ipfs_api_ip + ":" + lbConnector.settings.ipfs_gateway_port + "/ipfs/" + body.Hash}));
        cb(null, {"filePath":  lbConnector.settings.ipfs_api_ip + ":" + lbConnector.settings.ipfs_gateway_port + "/ipfs/" + body.Hash, uploadDir: uploadDir});
  		} else {
        console.log(error);
  			error = {}
  			error.errorid = true;
  			error.errorcode="-32003";
  			error.message = "Unable to store files on ipfs";
  			//res.end(JSON.stringify(error))
        cb(error);
  			// tracing.create('ERROR', 'GET ipfs/assets/upload', 'IPFS server error');
  		}
  	});

  });

}

exports.upload = upload;
