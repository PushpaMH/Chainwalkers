"use strict"

var reload = require('require-reload')(require),
    modules = reload(__dirname + '/../index');
var ipfs = modules.ipfs;
var path = require('path');
var fs = require('fs');
var error = null;

var checkModelExists = function(modelName, is_deploying) {
  var saveDir = path.join(__dirname+'/../../../../model');
  if (is_deploying==false){
    if(fs.existsSync(path.join(saveDir + '/models.json'))) {
      var data = JSON.parse(fs.readFileSync(path.join(saveDir + '/models.json'), 'utf8'));
      var existingModel = data.models.filter((model) => {
        return (model.modelName === modelName)
      });
      if(existingModel.length > 0) {
        //cb('The model of this modelName already exists! Please select a different name', null);
        return true;
      } else {
        return false;
      }
    }
  }else{
    if(fs.existsSync(path.join(saveDir + '/models.json'))) {
      var data = JSON.parse(fs.readFileSync(path.join(saveDir + '/models.json'), 'utf8'));
      var existingModel = data.models.filter((model) => {
        return (model.modelName === modelName && model.is_deployed === true)
      });
      if(existingModel.length > 0) {
        //cb('The model of this modelName already exists! Please select a different name', null);
        return true;
      } else {
        return false;
      }
    }
  }
}

var save = function (lbConnector, is_deploying ,xmlString, modelName, chaincode_ID, rawModel, incomingModel, isSaved, cb) {
  // upload the model to ipfs
  if (is_deploying==false){
    ipfs.upload(lbConnector, xmlString, rawModel, incomingModel, modelName, function(err, result) {
      if(err) {
        cb('ERROR: error uploading file to ipfs', null);
        return;
      }

      fs.unlinkSync(path.join(result.uploadDir, '/model.json'));
      fs.rmdirSync(result.uploadDir);

      var data = {};
      var saveDir = lbConnector.settings.modelfilepath;
      // path.join(__root, '/../model');

      if(!fs.existsSync(saveDir)){
        fs.mkdirSync(saveDir);
        data = {
          models: []
        };

        data.models.push({
          modelName: modelName,
          chaincode_ID: chaincode_ID,
          is_deployed: is_deploying,
          path: result.filePath
        });
      } else {
        if(fs.existsSync(path.join(saveDir + '/models.json'))) {
          //data = JSON.parse(fs.readFileSync('file', 'utf8'));
          data = JSON.parse(fs.readFileSync(path.join(saveDir + '/models.json'), 'utf8'));
          if(checkModelExists(modelName, is_deploying)) {
            var existingModel = data.models.filter((model) => {
              return model.modelName === modelName
            })[0];
            existingModel.path = result.filePath;
            if(chaincode_ID !== null && isSaved) {
              existingModel.chaincode_ID = chaincode_ID;
            }
          } else {
            data.models.push({
              modelName: modelName,
              chaincode_ID: chaincode_ID,
              is_deployed: is_deploying,
              path: result.filePath
            });
          }
        }
      }
      fs.truncate(saveDir + '/models.json', 0, function() {
        fs.writeFile(saveDir + '/models.json', JSON.stringify(data), function (err, data) {
          if (err) {
            console.log('file writing error: ' + err);
          }
          console.log("file writing successfull of model - " + modelName);
        });
      });
      cb(null, result.filePath);
    })
  }else{
    ipfs.upload(lbConnector, xmlString, rawModel, incomingModel, modelName, function(err, result) {
      if(err) {
        cb('ERROR: error uploading file to ipfs', null);
        return;
      }

      fs.unlinkSync(path.join(result.uploadDir, '/model.json'));
      fs.rmdirSync(result.uploadDir);

      var data = {};
      var saveDir = lbConnector.settings.modelfilepath;
      // path.join(__root, '/../model');

      if(!fs.existsSync(saveDir)){
        fs.mkdirSync(saveDir);
        data = {
          models: []
        };

        data.models.push({
          modelName: modelName,
          chaincode_ID: chaincode_ID,
          is_deployed: is_deploying,
          path: result.filePath
        });
      } else {
        if(fs.existsSync(path.join(saveDir + '/models.json'))) {
          //data = JSON.parse(fs.readFileSync('file', 'utf8'));
          data = JSON.parse(fs.readFileSync(path.join(saveDir + '/models.json'), 'utf8'));
          if(checkModelExists(modelName, false)) {
            var existingModel = data.models.filter((model) => {
              return model.modelName === modelName
            })[0];
            existingModel.path = result.filePath;
            //if(chaincode_ID !== null && isSaved) {
            existingModel.chaincode_ID = chaincode_ID;
            //}
            existingModel.is_deployed = true;
          } else {
            data.models.push({
              modelName: modelName,
              chaincode_ID: chaincode_ID,
              is_deployed: is_deploying,
              path: result.filePath
            });
          }
        }
      }
      fs.truncate(saveDir + '/models.json', 0, function() {
        fs.writeFile(saveDir + '/models.json', JSON.stringify(data), function (err, data) {
          if (err) {
            console.log('file writing error: ' + err);
          }
          console.log("file writing successfull of model - " + modelName);
        });
      });
      cb(null, result.filePath);
    })
  }
};

exports.save = save;
exports.check = checkModelExists;
