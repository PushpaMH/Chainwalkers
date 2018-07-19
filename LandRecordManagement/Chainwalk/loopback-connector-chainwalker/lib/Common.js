//
// Copyright IBM Corp. All Rights Reserved.
//
// SPDX-License-Identifier: Apache-2.0
//
var reload = require('require-reload')(require),
  modules = reload(__dirname + '/index');
const sdkutils = require('fabric-client/lib/utils');
var logger = sdkutils.getLogger('loopback-connector-fabric/lib/Common.js');
var ConfigLoader = require('loopback-boot/lib/config-loader');
var request = require('request');
var loopbackConnectorFabric = require('loopback-connector-fabric');
var Q = require("q");
var path = require('path');
var fs = require('fs');
var xmlGenerator = new modules.utility.xmlGenerator();
var util = modules.utility;

//Use this file for common utility functions

/**
 * Log entry to a function
 */
var logEntry = function(aLogger, aFunction) {
  aLogger.debug(new Date().toISOString() + " >>> " + aFunction.name);
}

var fetchModelFromIPFS = function(modelPath, cb) {
  var options = {
    url: modelPath,
    method: "get",
    json: true
  };

  console.log("options = " + JSON.stringify(options));
  request(options, function(error, response, body) {
    if (response != undefined && response.statusCode == 200 && !body.hasOwnProperty("error")) {
      console.log("response: ", body);
      return cb(body);
    } else {
      console.log(error);
      error = {}
      error.errorid = true;
      error.errorcode = "-32003";
      error.message = "Unable to get file from ipfs";
      return cb(error);
    }
  });
}

var getReponse = function(statusCode, status, message) {
  return {
    statusCode: statusCode,
    status: status,
    message: message
  };
}

var deploy = function(incomingModel, modelName, rawModel, isSaved, fc, cc, cb) {

  console.log("-----------------------------------------------------------------------");
  console.log("Deploying Model . . .");
  console.log("-----------------------------------------------------------------------");

  var xmlString = xmlGenerator.generateXML(incomingModel);

  if (util.check(modelName, true)) {
    return Promise.reject(getReponse("500", "failed", 'The model of this modelName "' + modelName + '" already exists! Please select a different name'));
  }

  var chaincodeID = "chainwalker" + (Math.floor(Math.random() * 900) + 100).toString();
  var chaincode_install = {
    "chaincodePath": cc.settings.chaincodePath,
    "chaincodeId": chaincodeID,
    "chaincodeVersion": cc.settings.chaincodeVersion,
    // "chaincodePackage": "",
    "chaincodeType": cc.settings.chaincodeType
  };

  var peers = undefined;
  var channelName = cc.settings.channelName;
  var chaincode_instantiate = {
    "chaincodeId": chaincodeID,
    "chaincodeVersion": cc.settings.chaincodeVersion,
    "chaincodeType": cc.settings.chaincodeType,
    "fcn": "init",
    "args": [
      xmlString
    ]
  };

  fc.postChaincodes(peers, chaincode_install, fc, msppathOrg1, "org1").then(
    function(response) {
      var msppathOrg2 = getAdminCertPath(USERS[access_token].userName , USERS[access_token].password, "org2", cc);

      fc.postChaincodes(peers, chaincode_install, fc, msppathOrg2, "org2").then(
        function(response) {
          var msppath;
          if (USERS[access_token].org == "org1") {
            msppath = msppathOrg1;
          } else {
            msppath = msppathOrg2;
          }
          fc.postChannelsChannelNameChaincodes(channelName, peers, chaincode_instantiate, fc, msppath, USERS[access_token].org).then(
            function(response) {
              util.save(cc, true, xmlString, modelName, chaincodeID, rawModel, incomingModel, isSaved, function(err, data) {
                if (err) {
                  return d.reject(err);
                }
                console.log("The model stored on ipfs @ - " + data);
                return d.resolve({
                  status: "ok",
                  chainID: chaincodeID
                });
              });
            },
            function(err) {
              if(err.message=="Error: Invalid results returned ::NOT_FOUND"){
                return d.reject(getReponse("500", "failed", "channel not created for deploying the chaincode."));
              }else{
                return d.reject(getReponse("500", "failed", err.message));
              }
            }
          );
        },
        function(err) {
          return d.reject(getReponse("500", "failed", err.message));
        }
      )
    },
    function(err) {
      return d.reject(getReponse("500", "failed", err.message));
    }
  );

}

var getChaincodeIDFromModelName = function(modelName, lbConnector){
  var chaincodeID;
  var modelfile = path.join(lbConnector.settings.modelfilepath + '/models.json');
  if (fs.existsSync(modelfile)) {
    var data = JSON.parse(fs.readFileSync(modelfile, 'utf8'));
    for(var i=0; i < data.models.length; i++){
      if(data.models[i].modelName == modelName){
        chaincodeID = data.models[i].chaincode_ID;
        return chaincodeID;
      }
    }
  }
}

var getIPFSFilePathFromModelName = function(modelName, lbConnector){
  var ipfsModelFilePath;
  var modelfile = path.join(lbConnector.settings.modelfilepath + '/models.json');
  if (fs.existsSync(modelfile)) {
    var data = JSON.parse(fs.readFileSync(modelfile, 'utf8'));
    for(var i=0; i < data.models.length; i++){
      if(data.models[i].modelName == modelName){
        ipfsModelFilePath = data.models[i].path;
        return ipfsModelFilePath;
      }
    }
  }
}

var isModelNameUnique = function(modelName, lbConnector){
  var ipfsModelFilePath;
  var modelfile = path.join(lbConnector.settings.modelfilepath + '/models.json');
  if (fs.existsSync(modelfile)) {
    var data = JSON.parse(fs.readFileSync(modelfile, 'utf8'));
    for(var i=0; i < data.models.length; i++){
      if(data.models[i].modelName == modelName){
        return false;
      }
    }
  }
  return true;
}

var parseJson = function(dataTemplate, currentLine){
  var json = JSON.parse(currentLine);
  var result="{";
  var result = result + "\"EntName\":\"Entity\",\"EntId\": \"" + json["EntityId"] + "\", \"SubEntities\":[";
  for(var i=0; i<dataTemplate.length; i++){
    var subEntity = dataTemplate[i];
    if(i != 0){
      result = result + ",";
    }
    result = result + "{\"" + subEntity.subEntName + "\":{";
    for(var j=0; j< subEntity.attributes.length; j++){
      if(j != 0){
        result = result + ",";
      }
      result = result + "\"" + subEntity.attributes[j].attr_name + "\": \"" + json[subEntity.subEntName+":"+subEntity.attributes[j].attr_name] + "\"";
    }
    result = result + "}}";
  }
  result = result + "]}";
//console.log("****************** >>> "+ result);
 return result;
}

var getAdminCertPath = function(username, password, org, lbConnector){
  for(var i = 0; i < lbConnector.settings["adminusers"].length;i++){
    if(lbConnector.settings["adminusers"][i]["username"] === username && lbConnector.settings["adminusers"][i]["password"] === password){
      var orgmsppath = org + "_msppath";
      return lbConnector.settings["adminusers"][i][orgmsppath];
    }
  }
  return "";
}

exports.logEntry = logEntry
exports.fetchModelFromIPFS = fetchModelFromIPFS
exports.deploy = deploy
exports.getReponse = getReponse
exports.getChaincodeIDFromModelName = getChaincodeIDFromModelName
exports.getIPFSFilePathFromModelName = getIPFSFilePathFromModelName
exports.isModelNameUnique = isModelNameUnique
exports.parseJson = parseJson
exports.getAdminCertPath = getAdminCertPath
