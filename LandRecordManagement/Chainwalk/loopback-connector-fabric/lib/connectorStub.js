//
// Copyright IBM Corp. All Rights Reserved.
//
// SPDX-License-Identifier: Apache-2.0
//
'use strict';

//MUST inherit from loopback's Connector
var Connector = require('loopback-connector').Connector

const FabricConnector = require('./fabricconnector');

/**
* A loopback connector for the fabric-node-sdk for fabric v1
* - Pass information about the User credentials.
* TODO: Extend to allow callers to specify User to use.
*/

/**
 * Initialize the connector for the given data source
 *
 * @param {DataSource} ds The data source instance
 * @param {Function} [cb] The cb function
 */
exports.initialize = function(ds, cb) {
  //console.log(">> initialize");
  //console.log(JSON.stringify(ds.settings));
  ds.connector = new FabricConnector(ds.settings);
  // console.log("^^^^^^^^^^^^^^^^^^^^^");
  // console.log(JSON.stringify(ds.connector.settings.connector));
  ds.connector.dataSource = ds;
  // console.log("<< initialize");
  // ds.connector.postChaincodes("[0]", "chaincode_install",ds.connector.settings.connector).then(
  //
  // );
  cb();
};

exports.init = function(ds, cb) {
  //console.log(JSON.stringify(ds.settings));
  ds.connector = new FabricConnector(ds.settings);
  ds.connector.dataSource = ds;
  cb( ds.connector);
};

  exports.connect = function(callback){
    //console.log(">> connect()");

    //TODO: Validate can connect to Fabric with the configured credentials
    //hfcsdk.Chain.connect(???)
    callback('OK'); //TODO

    //console.log("<< connect()");
  };

  exports.disconnect = function(callback){
    //console.log(">> disconnect()");

    // No op.
    callback(null);

    //console.log("<< disconnect()");
  };

  exports.ping = function(callback){
    //console.log(">> ping()");

    // No op.
    callback(null);

    //console.log("<< ping()");
  };
