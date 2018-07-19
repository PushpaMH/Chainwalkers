//export all chaincode modules
"use strict"

module.exports ={
  xmlGenerator: require(__dirname + '/xmlgen').xmlGenerator,
  save: require(__dirname + '/saveModel').save,
  check: require(__dirname + '/saveModel').check
}
