'use strict';

//MUST inherit from loopback's Connector
var reload = require('require-reload')(require),
  modules = reload(__dirname + '/index');
var Connector = require('loopback-connector').Connector
var Converter = require("csvtojson").Converter;
var Common = require('./Common.js');
var path = require('path');
var fs = require('fs');
const sdkutils = require('fabric-client/lib/utils');
var logger = sdkutils.getLogger(__filename.slice(__dirname.length + 1));
var request = require('request');
var util = modules.utility;
var xmlGenerator = new modules.utility.xmlGenerator();
var loopbackConnectorFabric = require('loopback-connector-fabric');
var Q = require("q");
var randtoken = require('rand-token');
var USERS = {};

//A class that extends Connector to allow functions to be called from a Model.
class ChainwalkerConnector extends Connector {
  constructor(settings) {
    super();
    Connector.call(this, 'chainwalker', settings);
    this.settings = settings; // Store the settings for ease of access
  };

  isAdmin(access_token) {
    if (USERS[access_token] && USERS[access_token].userName === 'admin') {
      return true;
    }
    return false;
  }

  getUser(access_token) {
    return USERS[access_token];
  }

  registerNewUser(username, password, org, access_token, fc) {
    var d = Q.defer();
    if (this.isAdmin(access_token)) {
      fc.registerNewUser(USERS[access_token].userName, USERS[access_token].password, username, password, fc, org).then((result) => {
        d.resolve("Successfully registered user - " + username);
      }, (err) => {
        d.reject(err);
      });
    } else {
      return Promise.reject(Common.getReponse("400", "Failed", "Only Admin can perform this action. Please login with Admin and try again."));
    }
    return d.promise;
  }

  logout(access_token) {
    var d = Q.defer();
    delete USERS[access_token];
    d.resolve("User logged out successfully !!!");
    return d.promise;
  }

  login(enrollmentID, enrollmentSecret, org, fc) {
    var d = Q.defer();
    var now = new Date(),
      date = new Date(now);
    date.setMinutes(now.getMinutes() + 3000);

    if (enrollmentID === 'admin' && enrollmentSecret === 'adminpw') {
      fc.enrollAdmin(fc, org).then((admin, message) => {
        var token = randtoken.generate(20);
        USERS[token] = {
          "userName": enrollmentID,
          "password": enrollmentSecret,
          "org": org
        };

        setTimeout(function() {
          console.log("Session timeout for user - " + enrollmentID);
          delete USERS[token];
        }, date - now);

        d.resolve({
          status: "OK",
          username: enrollmentID,
          access_token: token.toString(),
          loggedInAt: now,
          expiresAt: date
        });
      }, (err) => {
        d.reject(err);
      });
    } else {
      fc.enrollUser(enrollmentID, enrollmentSecret, fc, org).then((result) => {
        var token = randtoken.generate(20);
        USERS[token] = {
          "userName": enrollmentID,
          "password": enrollmentSecret,
          "org": org
        };

        setTimeout(function() {
          console.log("Session timeout for user - " + enrollmentID);
          delete USERS[token];
        }, date - now);

        d.resolve({
          status: "OK",
          username: enrollmentID,
          access_token: token.toString(),
          loggedInAt: now,
          expiresAt: date
        });
      }, (err) => {
        d.reject(Common.getReponse("500", "failed", err.message));
      });
    }
    return d.promise;
  }

  createChannel(channelName, access_token, fc, cc) {
    var d = Q.defer();
    if (this.isAdmin(access_token)) {
      var msppath = Common.getAdminCertPath(USERS[access_token].userName, USERS[access_token].password, USERS[access_token].org, cc);
      if (channelName != cc.settings.channelName) {
        return Promise.resolve(Common.getReponse("500", "failed", "It is not a valid channelName"));
      }
      var envelope_bytes = fs.readFileSync(path.join(__dirname, '../../../artifacts/channel/channel.tx'));
      var signatures = [];
      var channelReq = {
        signatures: signatures,
        envelope: envelope_bytes
      };
      fc.postChannelsChannelName(channelName, channelReq, fc, msppath).then(
        function(response) {
          return d.resolve(response);
        },
        function(err) {
          return d.reject(Common.getReponse("500", "failed", err.message));
        }
      );
    } else {
      return Promise.reject(Common.getReponse("400", "Failed", "Only Admin can perform this action. Please login with Admin and try again."));
    }
    return d.promise;
  }

  joinChannel(channelName, access_token, fc, cc) {
    var d = Q.defer();
    if (this.isAdmin(access_token)) {
      if (channelName != cc.settings.channelName) {
        return Promise.resolve(Common.getReponse("500", "failed", "It is not a valid channelName"));
      }

      var msppath = Common.getAdminCertPath(USERS[access_token].userName, USERS[access_token].password, "org1", cc);
      var peerInfo = [];
      var peers = fc.settings["org1"].peers;
      for (var i = 0; i < peers.length; i++) {
        var data = fs.readFileSync(path.join(__dirname, '../../../', peers[i].publicCertFile));
        var peer_obj = {
          url: peers[i].requestURL,
          opts: {
            pem: Buffer.from(data).toString(),
            'ssl-target-name-override': peers[i].hostname
          }
        };
        peerInfo.push(peer_obj);
      }

      fc.postChannelsChannelNamePeers(channelName, peerInfo, fc, msppath, "org1").then(
        function(response) {
          msppath = Common.getAdminCertPath(USERS[access_token].userName, USERS[access_token].password, "org2", cc);
          peerInfo = [];
          peers = fc.settings["org2"].peers;
          for (var i = 0; i < peers.length; i++) {
            var data = fs.readFileSync(path.join(__dirname, '../../../', peers[i].publicCertFile));
            var peer_obj = {
              url: peers[i].requestURL,
              opts: {
                pem: Buffer.from(data).toString(),
                'ssl-target-name-override': peers[i].hostname
              }
            };
            peerInfo.push(peer_obj);
          }

          fc.postChannelsChannelNamePeers(channelName, peerInfo, fc, msppath, "org2").then(
            function(response) {
              return d.resolve(response);
            },
            function(err) {
              return d.reject(Common.getReponse("500", "failed", err.message));
            }
          );
          return d.resolve(response);
        },
        function(err) {
          return d.reject(Common.getReponse("500", "failed", err.message));
        }
      );
    } else {
      return Promise.reject(Common.getReponse("400", "Failed", "Only Admin can perform this action. Please login with Admin and try again."));
    }
    return d.promise;
  }

  deployModel(modelName, deployAsModelName, deployRequest, access_token, fc, cc) {
    var d = Q.defer();
    if (this.isAdmin(access_token)) {
      var msppathOrg1 = Common.getAdminCertPath(USERS[access_token].userName, USERS[access_token].password, "org1", cc);
      if (modelName != undefined && deployAsModelName != undefined) {
        var ipfsModelFilePath = Common.getIPFSFilePathFromModelName(modelName, cc);
        Common.fetchModelFromIPFS(ipfsModelFilePath, function(ipfsResponse) {
          var incomingModel = ipfsResponse.standardModel;
          console.log("-----------------------------------------------------------------------");
          console.log("Deploying Model using with the xmlString given as input . . .");
          console.log("-----------------------------------------------------------------------");
          var modelName = deployAsModelName;
          var rawModel = ipfsResponse.rawModel;
          var isSaved = ipfsResponse.isSaved;
          var xmlString = ipfsResponse.xmlString;
          if (util.check(modelName, true)) {
            return Promise.reject(Common.getReponse("500", "failed", 'The model of this modelName "' + modelName + '" already exists! Please select a different name'));
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
              var msppathOrg2 = Common.getAdminCertPath(USERS[access_token].userName, USERS[access_token].password, "org2", cc);
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
                      if (err.message == "Error: Invalid results returned ::NOT_FOUND") {
                        return d.reject(Common.getReponse("500", "failed", "channel not created for deploying the chaincode."));
                      } else {
                        return d.reject(Common.getReponse("500", "failed", err.message));
                      }
                    }
                  );
                },
                function(err) {
                  return d.reject(Common.getReponse("500", "failed", err.message));
                }
              )
            },
            function(err) {
              return d.reject(Common.getReponse("500", "failed", err.message));
            }
          );
          // End
        });
      } else if (JSON.stringify(deployRequest) != '{}') {
        console.log("-----------------------------------------------------------------------");
        console.log("Deploying Model using with the xmlString given as input . . .");
        console.log("-----------------------------------------------------------------------");

        var incomingModel = deployRequest.model;
        var modelName = deployRequest.modelName;
        var rawModel = deployRequest.rawModel;
        var isSaved = deployRequest.isSaved;
        var xmlString = xmlGenerator.generateXML(incomingModel);

        if (util.check(modelName, true)) {
          return Promise.reject(Common.getReponse("500", "failed", 'The model of this modelName "' + modelName + '" already exists! Please select a different name'));
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
            var msppathOrg2 = Common.getAdminCertPath(USERS[access_token].userName, USERS[access_token].password, "org2", cc);

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
                    if (err.message == "Error: Invalid results returned ::NOT_FOUND") {
                      return d.reject(Common.getReponse("500", "failed", "channel not created for deploying the chaincode."));
                    } else {
                      return d.reject(Common.getReponse("500", "failed", err.message));
                    }
                  }
                );
              },
              function(err) {
                return d.reject(Common.getReponse("500", "failed", err.message));
              }
            )
          },
          function(err) {
            return d.reject(Common.getReponse("500", "failed", err.message));
          }
        );

        // ENd
      } else {
        return Promise.reject(Common.getReponse("500", "failed", "DEPLOY ERROR : Missing parameter. Please provide one of modelName & deployAsModelName or deployRequest for deploy"));
      }
    } else {
      return Promise.reject(Common.getReponse("400", "Failed", "Only Admin can perform this action. Please login with Admin and try again."));
    }

    return d.promise;
  }

  addEntity(modelName, entity, access_token, fc, cc) {
    console.log("-----------------------------------------------------------------------");
    console.log("Adding Entity . . .");
    console.log("-----------------------------------------------------------------------");
    var user = USERS[access_token];
    var is_admin = this.isAdmin(access_token);
    var d = Q.defer();
    if (USERS[access_token] == null) {
      return Promise.reject(Common.getReponse("400", "failed", "User is not logged in."));
    }
    var msppath = "";
    if (is_admin) {
      msppath = Common.getAdminCertPath(user.userName, user.password, user.org, cc);
    }
    var chaincodeID = Common.getChaincodeIDFromModelName(modelName, cc);
    var add_invoke_request = {
      "proposal": {
        "chaincodeId": chaincodeID,
        "fcn": "addEntity",
        "args": [JSON.stringify(entity.Entity)]
      }
    };
    fc.postChannelsChannelNameTransactions(cc.settings.channelName, add_invoke_request, fc, user.userName, user.password, is_admin, msppath, user.org).then(
      function(response) {
        return d.resolve(response);
      },
      function(err) {
        return d.reject(Common.getReponse("500", "failed", err.message));
      }
    );
    return d.promise;
  }

registerSaledeed(modelName, saledeed, access_token, fc, cc) {
  console.log("-----------------------------------------------------------------------");
  console.log("Saledeed Processing. . .");
  console.log("-----------------------------------------------------------------------");
  var is_admin = this.isAdmin(access_token);
  var d = Q.defer();
  if (USERS[access_token] == null) {
    return Promise.reject(Common.getReponse("400", "failed", "User is not logged in."));
  }
  var msppath = "";
  if (is_admin) {
    msppath = Common.getAdminCertPath(USERS[access_token].userName, USERS[access_token].password, USERS[access_token].org, cc);
  }

  var chaincodeID = Common.getChaincodeIDFromModelName(modelName, cc);
  var add_invoke_request = {
    "proposal": {
      "chaincodeId": chaincodeID,
      "fcn": "registerSaledeed",
      "args": [JSON.stringify(saledeed)]
    }
  };

  var peers = [0];
  var d = Q.defer();
  fc.postChannelsChannelNameTransactions(cc.settings.channelName, add_invoke_request, fc, USERS[access_token].userName, USERS[access_token].password, is_admin, msppath, USERS[access_token].org).then(
    function(response) {
      return d.resolve(response);
    },
    function(err) {
      return d.reject(Common.getReponse("500", "failed", err.message));
    }
  );
  return d.promise;
}

saledeedAppointment(modelName, saledeed, access_token, fc, cc) {
  console.log("-----------------------------------------------------------------------");
  console.log("saledeedAppointment Processing. . .");
  console.log("-----------------------------------------------------------------------");
  var is_admin = this.isAdmin(access_token);
  var d = Q.defer();
  if (USERS[access_token] == null) {
    return Promise.reject(Common.getReponse("400", "failed", "User is not logged in."));
  }
  var msppath = "";
  if (is_admin) {
    msppath = Common.getAdminCertPath(USERS[access_token].userName, USERS[access_token].password, USERS[access_token].org, cc);
  }

  var chaincodeID = Common.getChaincodeIDFromModelName(modelName, cc);
  var add_invoke_request = {
    "proposal": {
      "chaincodeId": chaincodeID,
      "fcn": "saledeedAppointment",
      "args": [JSON.stringify(saledeed)]
    }
  };

  var peers = [0];
  var d = Q.defer();
  fc.postChannelsChannelNameTransactions(cc.settings.channelName, add_invoke_request, fc, USERS[access_token].userName, USERS[access_token].password, is_admin, msppath, USERS[access_token].org).then(
    function(response) {
      return d.resolve(response);
    },
    function(err) {
      return d.reject(Common.getReponse("500", "failed", err.message));
    }
  );
  return d.promise;
}

getEntity(modelName, entID, access_token, fc, cc) {
  console.log("-----------------------------------------------------------------------");
  console.log("Get Entity ...");
  console.log("-----------------------------------------------------------------------");

  var d = Q.defer();
  if (USERS[access_token] == null) {
    return Promise.reject(Common.getReponse("400", "failed", "User is not logged in."));
  }
  var msppath = "";
  if (this.isAdmin(access_token)) {
    msppath = Common.getAdminCertPath(USERS[access_token].userName, USERS[access_token].password, USERS[access_token].org, cc);
  }

  var chaincodeID = Common.getChaincodeIDFromModelName(modelName, cc);
  var get_request = {
    "fcn": "getEntity"
  };
  if (entID == undefined) {
    get_request.args = [""];
  } else {
    get_request.args = [entID.toString()];
  }
  var user = USERS[access_token];
  var is_admin = this.isAdmin(access_token);
  fc.postChannelsChannelNameLedger(cc.settings.channelName, chaincodeID, null, null, null, get_request, fc, user.userName, user.password, is_admin, msppath, user.org).then(
    function(response) {
      return d.resolve(response);
    },
    function(err) {
      return d.reject(Common.getReponse("500", "failed", err.message));
    }
  );
  return d.promise;
}

getEntityFromCouch(modelName, entID, access_token, fc, cc) {
  console.log("-----------------------------------------------------------------------");
  console.log("Get Entity From couch...");
  console.log("-----------------------------------------------------------------------");

  var d = Q.defer();
  if (USERS[access_token] == null) {
    return Promise.reject(Common.getReponse("400", "failed", "User is not logged in."));
  }
  var msppath = "";
  if (this.isAdmin(access_token)) {
    msppath = Common.getAdminCertPath(USERS[access_token].userName, USERS[access_token].password, USERS[access_token].org, cc);
  }

  var chaincodeID = Common.getChaincodeIDFromModelName(modelName, cc);
  var get_request = {
    "fcn": "getEntityFromCouch"
  };
  if (entID == undefined) {
    get_request.args = [""];
  } else {
    get_request.args = [entID.toString()];
  }
  var user = USERS[access_token];
  var is_admin = this.isAdmin(access_token);
  fc.postChannelsChannelNameLedger(cc.settings.channelName, chaincodeID, null, null, null, get_request, fc, user.userName, user.password, is_admin, msppath, user.org).then(
    function(response) {
      return d.resolve(response);
    },
    function(err) {
      return d.reject(Common.getReponse("500", "failed", err.message));
    }
  );
  return d.promise;
}

GetLandRecordsBy(modelName, searchCriteria, access_token, fc, cc) {
  console.log("-----------------------------------------------------------------------");
  console.log("Search By...");
  console.log("-----------------------------------------------------------------------");

  var d = Q.defer();
  if (USERS[access_token] == null) {
    return Promise.reject(Common.getReponse("400", "failed", "User is not logged in."));
  }
  var msppath = "";
  if (this.isAdmin(access_token)) {
    msppath = Common.getAdminCertPath(USERS[access_token].userName, USERS[access_token].password, USERS[access_token].org, cc);
  }

  var chaincodeID = Common.getChaincodeIDFromModelName(modelName, cc);
  var get_request = {
    "fcn": "GetLandRecordsBy"
  };
  get_request.args = [searchCriteria];
  var user = USERS[access_token];
  var is_admin = this.isAdmin(access_token);
  fc.postChannelsChannelNameLedger(cc.settings.channelName, chaincodeID, null, null, null, get_request, fc, user.userName, user.password, is_admin, msppath, user.org).then(
    function(response) {
      return d.resolve(response);
    },
    function(err) {
      return d.reject(Common.getReponse("500", "failed", err.message));
    }
  );
  return d.promise;
}

GetLandRecordsTrail(modelName, propertyID, access_token, fc, cc) {
  console.log("-----------------------------------------------------------------------");
  console.log("Get Trail . . .");
  console.log("-----------------------------------------------------------------------");

  var d = Q.defer();
  if (USERS[access_token] == null) {
    return Promise.reject(Common.getReponse("400", "failed", "User is not logged in."));
  }
  var msppath = "";
  if (this.isAdmin(access_token)) {
    msppath = Common.getAdminCertPath(USERS[access_token].userName, USERS[access_token].password, USERS[access_token].org, cc);
  }

  var chaincodeID = Common.getChaincodeIDFromModelName(modelName, cc);
  var get_request = {
    "fcn": "GetLandRecordsTrail"
  };
  if (propertyID == undefined) {
    get_request.args = [""];
  } else {
    get_request.args = [propertyID];
  }
  var user = USERS[access_token];
  var is_admin = this.isAdmin(access_token);
  fc.postChannelsChannelNameLedger(cc.settings.channelName, chaincodeID, null, null, null, get_request, fc, user.userName, user.password, is_admin, msppath, user.org).then(
    function(response) {
      return d.resolve(response);
    },
    function(err) {
      return d.reject(Common.getReponse("500", "failed", err.message));
    }
  );
  return d.promise;
}

};

module.exports = ChainwalkerConnector;
