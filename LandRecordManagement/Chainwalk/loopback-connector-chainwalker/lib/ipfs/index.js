//export all ipfs modules
"use strict"

module.exports ={
  upload: require(__dirname+'/upload.js').upload,
  get: require(__dirname+'/getModel.js').get
}
