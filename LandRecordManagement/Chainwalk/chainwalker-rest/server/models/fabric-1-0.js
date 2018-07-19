//
// Copyright IBM Corp. All Rights Reserved.
//
// SPDX-License-Identifier: Apache-2.0
//
module.exports = function(SwaggerApi) {

  /**
   * Register a new user
   * @param {Object} usercredentials username and password
   * @param {string} org organization name
   * @param {string} access_token access token
   * @callback {Function} callback Callback function
   * @param {Error|string} err Error object
   * @param {any} result Result object
   */
  SwaggerApi.registerNewUser = function(usercredentials, org, access_token, callback) {
    var fabricconnector = SwaggerApi.app.datasources.fabricDataSource.connector;
    var cwconnector = SwaggerApi.app.datasources.chainwalkerDataSource.connector;
    cwconnector.registerNewUser(usercredentials.username, usercredentials.password, org, access_token, fabricconnector).then(
      function(response) {
        callback(null, response);
      },
      function(err) {
        callback(err);
      }
    );
  }

  /**
   * Login to the chainwalker application
   * @param {string} username username
   * @param {string} password password
   * @param {string} org organization name
   * @param {string} access_token access token
   * @callback {Function} callback Callback function
   * @param {Error|string} err Error object
   * @param {any} result Result object
   */
  SwaggerApi.login = function(username, password, org, callback) {
    var fabricconnector = SwaggerApi.app.datasources.fabricDataSource.connector;
    var cwconnector = SwaggerApi.app.datasources.chainwalkerDataSource.connector;
    cwconnector.login(username, password, org, fabricconnector).then(
      function(response) {
        callback(null, response);
      },
      function(err) {
        callback(err);
      }
    );
  }

  /**
   * Logout from the chainwalker application
   * @param {string} access_token access token
   * @callback {Function} callback Callback function
   * @param {Error|string} err Error object
   * @param {any} result Result object
   */
  SwaggerApi.logout = function(access_token, callback) {
    var fabricconnector = SwaggerApi.app.datasources.fabricDataSource.connector;
    var cwconnector = SwaggerApi.app.datasources.chainwalkerDataSource.connector;
    cwconnector.logout(access_token, fabricconnector).then(
      function(response) {
        callback(null, response);
      },
      function(err) {
        callback(err);
      }
    );
  }

  /**
   * Create the business channel
   * @param {string} channelName name of the channel
   * @param {string} access_token access token
   * @callback {Function} callback Callback function
   * @param {Error|string} err Error object
   * @param {any} result Result object
   */
  SwaggerApi.createChannel = function(channelName, access_token, callback) {

    var fabricconnector = SwaggerApi.app.datasources.fabricDataSource.connector;
    var cwconnector = SwaggerApi.app.datasources.chainwalkerDataSource.connector;
    cwconnector.createChannel(channelName, access_token, fabricconnector, cwconnector).then(
      function(response) {
        callback(null, response);
      },
      function(err) {
        callback(err);
      }
    );
  }

  /**
   * Join peers to the business channel
   * @param {string} channelName name of the channel
   * @param {string} access_token access token
   * @callback {Function} callback Callback function
   * @param {Error|string} err Error object
   * @param {any} result Result object
   */
  SwaggerApi.joinChannel = function(channelName, access_token, callback) {
    var fabricconnector = SwaggerApi.app.datasources.fabricDataSource.connector;
    var cwconnector = SwaggerApi.app.datasources.chainwalkerDataSource.connector;
    cwconnector.joinChannel(channelName, access_token, fabricconnector, cwconnector).then(
      function(response) {
        callback(null, response);
      },
      function(err) {
        callback(err);
      }
    );
  }
  /**
   * Deploy chaincode onto the named peers
   * @param {string} modelName model name which is used to deploy a new smart contract
   * @param {string} deployAsModelName The new smart contract's name
   * @param {DeployModelrequest} deployRequest The chaincode install data.
   * @param {access_token} string access token
   * @callback {Function} callback Callback function
   * @param {Error|string} err Error object
   * @param {any} result Result object
   */
  SwaggerApi.deployModel = function(modelName, deployAsModelName, deployRequest, access_token, callback) {
    var fabricconnector = SwaggerApi.app.datasources.fabricDataSource.connector;
    var cwconnector = SwaggerApi.app.datasources.chainwalkerDataSource.connector;
    cwconnector.deployModel(modelName, deployAsModelName, deployRequest, access_token, fabricconnector, cwconnector).then(
      function(response) {
        callback(null, response);
      },
      function(err) {
        callback(err);
      }
    );
  }


  /**
   * @param {string} modelName name of the smart contract
   * @param {Entity} entity Entity JSON
   * @param {access_token} string access token
   * @callback {Function} callback Callback function
   * @param {Error|string} err Error object
   * @param {any} result Result object
   */
  SwaggerApi.addEntity = function(modelName, entity, access_token, callback) {

    var fabricconnector = SwaggerApi.app.datasources.fabricDataSource.connector;
    var cwconnector = SwaggerApi.app.datasources.chainwalkerDataSource.connector;
    cwconnector.addEntity(modelName, entity, access_token, fabricconnector, cwconnector).then(
      function(response) {
        callback(null, response);
      },
      function(err) {
        callback(err);
      }
    );
  }


  /**
   * @param {string} modelName name of the smart contract
   * @param {Entity} entity Entity JSON
   * @param {access_token} string access token
   * @callback {Function} callback Callback function
   * @param {Error|string} err Error object
   * @param {any} result Result object
   */
  SwaggerApi.registerSaledeed = function(modelName, saledeed, access_token, callback) {
    var fabricconnector = SwaggerApi.app.datasources.fabricDataSource.connector;
    var cwconnector = SwaggerApi.app.datasources.chainwalkerDataSource.connector;
    cwconnector.registerSaledeed(modelName, saledeed, access_token, fabricconnector, cwconnector).then(
      function(response) {
        callback(null, response);
      },
      function(err) {
        callback(err);
      }
    );
  }


  SwaggerApi.saledeedAppointment = function(modelName, saledeed, access_token, callback) {
    var fabricconnector = SwaggerApi.app.datasources.fabricDataSource.connector;
    var cwconnector = SwaggerApi.app.datasources.chainwalkerDataSource.connector;
    cwconnector.saledeedAppointment(modelName, saledeed, access_token, fabricconnector, cwconnector).then(
      function(response) {
        callback(null, response);
      },
      function(err) {
        callback(err);
      }
    );
  }
  /**
   * Query the channel's ledger
   * @param {string} entID entID to look for
   * @param {string} modelName Model name to look for
   * @param {access_token} string access token
   * @callback {Function} callback Callback function
   * @param {Error|string} err Error object
   * @param {TODO} result Result object
   */
  SwaggerApi.getEntity = function(modelName, entID, access_token, callback) {
    process.nextTick(function() {
      var fabricconnector = SwaggerApi.app.datasources.fabricDataSource.connector;
      var cwconnector = SwaggerApi.app.datasources.chainwalkerDataSource.connector;
      cwconnector.getEntity(modelName, entID, access_token, fabricconnector, cwconnector).then(
        function(response) {
          callback(null, response);
        },
        function(err) {
          callback(err);
        }
      );
    });
  }

  /**
   * Query the channel's ledger
   * @param {string} entID entID to look for
   * @param {string} modelName Model name to look for
   * @param {access_token} string access token
   * @callback {Function} callback Callback function
   * @param {Error|string} err Error object
   * @param {TODO} result Result object
   */
  SwaggerApi.getEntityFromCouch = function(modelName, queryString, access_token, callback) {
    process.nextTick(function() {
      var fabricconnector = SwaggerApi.app.datasources.fabricDataSource.connector;
      var cwconnector = SwaggerApi.app.datasources.chainwalkerDataSource.connector;
      cwconnector.getEntityFromCouch(modelName, queryString, access_token, fabricconnector, cwconnector).then(
        function(response) {
          callback(null, response);
        },
        function(err) {
          callback(err);
        }
      );
    });
  }

  /**
   * Query the channel's ledger
   * @param {string} entID entID to look for
   * @param {string} modelName Model name to look for
   * @param {access_token} string access token
   * @callback {Function} callback Callback function
   * @param {Error|string} err Error object
   * @param {TODO} result Result object
   */
  SwaggerApi.GetLandRecordsBy = function(modelName, searchCriteria, access_token, callback) {
    process.nextTick(function() {
      var fabricconnector = SwaggerApi.app.datasources.fabricDataSource.connector;
      var cwconnector = SwaggerApi.app.datasources.chainwalkerDataSource.connector;
      cwconnector.GetLandRecordsBy(modelName, searchCriteria, access_token, fabricconnector, cwconnector).then(
        function(response) {
          callback(null, response);
        },
        function(err) {
          callback(err);
        }
      );
    });
  }

  /**
   * Query the channel's ledger
   * @param {string} entID entID to look for
   * @param {string} modelName Model name to look for
   * @param {access_token} string access token
   * @callback {Function} callback Callback function
   * @param {Error|string} err Error object
   * @param {TODO} result Result object
   */
  SwaggerApi.GetLandRecordsTrail = function(modelName, propertyId, access_token, callback) {
    process.nextTick(function() {
      var fabricconnector = SwaggerApi.app.datasources.fabricDataSource.connector;
      var cwconnector = SwaggerApi.app.datasources.chainwalkerDataSource.connector;
      cwconnector.GetLandRecordsTrail(modelName, propertyId, access_token, fabricconnector, cwconnector).then(
        function(response) {
          callback(null, response);
        },
        function(err) {
          callback(err);
        }
      );
    });
  }


  SwaggerApi.remoteMethod('registerNewUser', {
    isStatic: true,
    accepts: [{
        arg: 'usercredentials',
        type: 'registerUserJson',
        description: 'User username & password',
        required: true,
        http: {
          source: 'body'
        }
      },
      {
        arg: 'org',
        type: 'string',
        description: 'organization name',
        required: true,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'access_token',
        type: 'string',
        description: 'access token',
        required: false,
        http: {
          source: 'query'
        }
      }
    ],
    returns: [{
      description: 'Successful response from orderer',
      type: 'ordererResponse',
      arg: 'data',
      root: true
    }],
    http: {
      verb: 'post',
      path: '/chaincodes/admin/registeruser'
    },
    description: 'Register new user to the BC network',
    notes: 'Register new user to the BC network'
  });

  SwaggerApi.remoteMethod('login', {
    isStatic: true,
    accepts: [{
        arg: 'username',
        type: 'string',
        description: 'username',
        required: true,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'password',
        type: 'string',
        description: 'password',
        required: true,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'org',
        type: 'string',
        description: 'organization name',
        required: true,
        http: {
          source: 'query'
        }
      }
    ],
    returns: [{
      description: 'Successful response from orderer',
      type: 'ordererResponse',
      arg: 'data',
      root: true
    }],
    http: {
      verb: 'post',
      path: '/chaincodes/users/login'
    },
    description: 'Login with a registered user credentials',
    notes: 'Login with a registered user credentials'
  });

  SwaggerApi.remoteMethod('logout', {
    isStatic: true,
    accepts: [{
      arg: 'access_token',
      type: 'string',
      description: 'access token',
      required: false,
      http: {
        source: 'query'
      }
    }],
    returns: [{
      description: 'Successful response from orderer',
      type: 'string',
      arg: 'data',
      root: true
    }],
    http: {
      verb: 'post',
      path: '/chainwalker/logout'
    },
    description: 'Logout of the chainwalker app',
    notes: 'Logout of the chainwalker app'
  });

  SwaggerApi.remoteMethod('createChannel', {
    isStatic: true,
    accepts: [{
        arg: 'channelName',
        type: 'string',
        description: 'channel name to create a channel with',
        required: true,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'access_token',
        type: 'string',
        description: 'access token',
        required: false,
        http: {
          source: 'query'
        }
      }
    ],
    returns: [{
      description: 'Successful response from orderer',
      type: 'string',
      arg: 'data',
      root: true
    }],
    http: {
      verb: 'post',
      path: '/chainwalker/chaincode/createChannel'
    },
    description: 'Create Channel for the BC network',
    notes: 'Create Channel for the BC network'
  });

  SwaggerApi.remoteMethod('joinChannel', {
    isStatic: true,
    accepts: [{
        arg: 'channelName',
        type: 'string',
        description: 'channel name for the peers to join with',
        required: true,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'access_token',
        type: 'string',
        description: 'access token',
        required: false,
        http: {
          source: 'query'
        }
      }
    ],
    returns: [{
      description: 'Successful response from orderer',
      type: 'string',
      arg: 'data',
      root: true
    }],
    http: {
      verb: 'post',
      path: '/chainwalker/chaincode/joinChannel'
    },
    description: 'Join the configured Peers to the channel',
    notes: 'Join the configured Peers to the channel'
  });

  SwaggerApi.remoteMethod('deployModel', {
    isStatic: true,
    accepts: [{
        arg: 'modelName',
        type: 'string',
        description: 'IPFS Model name to deploy',
        required: false,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'deployAsModelName',
        type: 'string',
        description: 'Unique model name to be deployed as',
        required: false,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'deployRequest',
        type: 'DeployModelrequest',
        description: 'Model details',
        required: false,
        http: {
          source: 'body'
        }
      },
      {
        arg: 'access_token',
        type: 'string',
        description: 'access token',
        required: false,
        http: {
          source: 'query'
        }
      }
    ],
    returns: [{
      description: 'Successful response from orderer',
      type: 'any',
      arg: 'data',
      root: true
    }],
    http: {
      verb: 'post',
      path: '/chaincodes/deploy'
    },
    description: 'Deploy new model on the Business network',
    notes: 'Deploy the entity model on to the blockchain network and saves it into IPFS. The input to this api could be the model in json format or the model name to fetch from previously stored model in IPFS repository.'
  });


  SwaggerApi.remoteMethod('addEntity', {
    isStatic: true,
    accepts: [{
        arg: 'modelName',
        type: 'string',
        description: 'Model name to look for',
        required: true,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'entity',
        type: 'Entity',
        description: 'Entity JSON to add',
        required: true,
        http: {
          source: 'body'
        }
      },
      {
        arg: 'access_token',
        type: 'string',
        description: 'access token',
        required: false,
        http: {
          source: 'query'
        }
      }
    ],
    returns: [{
      description: 'Successful response from orderer',
      type: 'any',
      arg: 'data',
      root: true
    }],
    http: {
      verb: 'post',
      path: '/chainwalker/addEntity'
    },
    description: 'Add a new entity to the Blockchain business network',
    notes: 'Add a new entity to the Blockchain business network'
  });


  SwaggerApi.remoteMethod('registerSaledeed', {
    isStatic: true,
    accepts: [{
        arg: 'modelName',
        type: 'string',
        description: 'Model name to look for',
        required: true,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'saledeed',
        type: 'any',
        description: 'Entity JSON to add',
        required: true,
        http: {
          source: 'body'
        }
      },
      {
        arg: 'access_token',
        type: 'string',
        description: 'access token',
        required: false,
        http: {
          source: 'query'
        }
      }
    ],
    returns: [{
      description: 'Successful response from orderer',
      type: 'any',
      arg: 'data',
      root: true
    }],
    http: {
      verb: 'post',
      path: '/chainwalker/registerSaledeed'
    },
    description: 'Update a existing entity in the Blockchain business network',
    notes: 'Update a existing entity in the Blockchain business network'
  });

  SwaggerApi.remoteMethod('saledeedAppointment', {
    isStatic: true,
    accepts: [{
        arg: 'modelName',
        type: 'string',
        description: 'Model name to look for',
        required: true,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'saledeed',
        type: 'any',
        description: 'Entity JSON to add',
        required: true,
        http: {
          source: 'body'
        }
      },
      {
        arg: 'access_token',
        type: 'string',
        description: 'access token',
        required: false,
        http: {
          source: 'query'
        }
      }
    ],
    returns: [{
      description: 'Successful response from orderer',
      type: 'any',
      arg: 'data',
      root: true
    }],
    http: {
      verb: 'post',
      path: '/chainwalker/saledeedAppointment'
    },
    description: 'Update a existing entity in the Blockchain business network',
    notes: 'Update a existing entity in the Blockchain business network'
  });

  SwaggerApi.remoteMethod('getEntity', {
    isStatic: true,
    accepts: [{
        arg: 'modelName',
        type: 'string',
        description: 'Model name to look for',
        required: true,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'entID',
        type: 'string',
        description: 'Entity ID to look for',
        required: false,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'access_token',
        type: 'string',
        description: 'access token',
        required: false,
        http: {
          source: 'query'
        }
      }
    ],
    returns: [{
      description: 'Successful response with data specific to the query',
      type: 'object',
      arg: 'data',
      root: true
    }],
    http: {
      verb: 'get',
      path: '/chainwalker/getEntity'
    },
    description: 'Retrieve an Entity by EntityID',
    notes: 'Retrieve an Entity by EntityID'
  });

  SwaggerApi.remoteMethod('getEntityFromCouch', {
    isStatic: true,
    accepts: [{
        arg: 'modelName',
        type: 'string',
        description: 'Model name to look for',
        required: true,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'queryString',
        type: 'string',
        description: 'query request',
        required: false,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'access_token',
        type: 'string',
        description: 'access token',
        required: false,
        http: {
          source: 'query'
        }
      }
    ],
    returns: [{
      description: 'Successful response with data specific to the query',
      type: 'object',
      arg: 'data',
      root: true
    }],
    http: {
      verb: 'get',
      path: '/chainwalker/getEntityFromCouch'
    },
    description: 'Retrieve an Entity by EntityID',
    notes: 'Retrieve an Entity by EntityID'
  });

  SwaggerApi.remoteMethod('GetLandRecordsBy', {
    isStatic: true,
    accepts: [{
        arg: 'modelName',
        type: 'string',
        description: 'Model name to look for',
        required: true,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'searchCriteria',
        type: 'string',
        description: 'query request',
        required: false,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'access_token',
        type: 'string',
        description: 'access token',
        required: false,
        http: {
          source: 'query'
        }
      }
    ],
    returns: [{
      description: 'Successful response with data specific to the query',
      type: 'object',
      arg: 'data',
      root: true
    }],
    http: {
      verb: 'get',
      path: '/chainwalker/getLandRecordsBy'
    },
    description: 'Search Land Records based on the search criteria given',
    notes: 'Search Land Records'
  });

  SwaggerApi.remoteMethod('GetLandRecordsTrail', {
    isStatic: true,
    accepts: [{
        arg: 'modelName',
        type: 'string',
        description: 'Model name to look for',
        required: true,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'propertyId',
        type: 'string',
        description: 'query request',
        required: false,
        http: {
          source: 'query'
        }
      },
      {
        arg: 'access_token',
        type: 'string',
        description: 'access token',
        required: false,
        http: {
          source: 'query'
        }
      }
    ],
    returns: [{
      description: 'Successful response with data specific to the query',
      type: 'object',
      arg: 'data',
      root: true
    }],
    http: {
      verb: 'get',
      path: '/chainwalker/getLandRecordsTrail'
    },
    description: 'Retrieve Land Records Trail for the given property ID',
    notes: 'Retrieve Land Records Trail'
  });

}
