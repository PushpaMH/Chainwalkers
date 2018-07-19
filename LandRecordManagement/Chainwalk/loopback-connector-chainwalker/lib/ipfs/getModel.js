"use strict"

var request = require("request")

var get = function(req,res) {
  var options = 	{
    url: req.query.url,
    method: "get",
    json: true
  };

  request(options, function(error, response, body) {
    console.log("Accessing URL : " + options.url);

    if (response != undefined && response.statusCode == 200 && !body.hasOwnProperty("error")) {
      console.log("response: ", body);
      res.status(200).send(body);

    } else {
      console.log(error);
      error = {}
      error.errorid = true;
      error.errorcode="-32003";
      error.message = "Unable to get file from ipfs";
      //res.end(JSON.stringify(error))
      res.status(500).send(JSON.stringify(error));
      // tracing.create('ERROR', 'GET file', 'IPFS server error');
    }
  });
};

exports.get = get;
