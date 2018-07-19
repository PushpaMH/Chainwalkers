"use strict"

var xmlgen = function() {

}
xmlgen.prototype = {
  generateXML: function(model) {
    var jstoxml = require("jstoxml");
    var typeArr = [];
    console.log("**************");
    console.log(model);
    console.log("**************");
    console.log("model json "+ JSON.stringify(model));
    model.types.forEach(function(type){
      var fieldArr = [];

      type.fields.forEach(function(field) {
        console.log("field.isrequiredfield.isrequired - " + field.isrequired);
        fieldArr.push({
          _name: 'objfield',
          _attrs: {
            id: field.id,
            fldname: field.name,
            fldlabel: field.label,
            isrequired: field.isrequired.toString(),
            fldtype: field.type,
          }
        });
      });

      typeArr.push({
        _name: 'Entity',
        _attrs: {
          name: type.name,
          tblname: 'bc_' + type.name.toLowerCase()
        },
        _content: fieldArr
      });
    });

    var inst_srvcArr = [];

    model.instances.forEach(function(instance) {
      inst_srvcArr.push({
        _name: 'SubEntity',
        _attrs: {
          name: instance.name,
          type: instance.type
        }
      });
    });

    var bucket_container_arr = [];
    model.bucketContainers.forEach(function(bkt_container){
      var bucket_arr=[];
      bkt_container.buckets.forEach(function(bkt){
      var bkt_attr_arr=[];
      bkt.attributes.forEach(function(attrlist){
        bkt_attr_arr.push({
          _name: 'bucketelement',
          _attrs:{
            subEntity: attrlist.subEntity,
            fldname: attrlist.fldname,
            matchingattr: attrlist.matchingattr,
            matchingfield: attrlist.matchingfield,
            matchingfunction: attrlist.matchingfunction,
            isanonymenabled: attrlist.isanonymenabled.toString()
          }
        });
      });
        bucket_arr.push({
          _name: 'bucket',
          _attrs: {
            name: bkt.name
          },
          _content: bkt_attr_arr
        });
    });
      bucket_container_arr.push({
        _name: 'bucketContainer',
        _attrs: {
          name: bkt_container.name
        },
        _content: bucket_arr
      });
    });

    var entityobj = {
      _name: "EntityType",
      _attrs: {
        name: model.entityName,
        algCode: 'PERSON_MATCHING'
      },
      _content: inst_srvcArr
    };

    var algorithm_obj ={
      _name: 'algorithm',
      _attrs:{
      },
      _content: bucket_container_arr
    };

    typeArr.push(entityobj);
    typeArr.push(algorithm_obj);

    var finalObject = {
      _name: 'CWDynamicModel',
      _content: typeArr
    }
    var xml = jstoxml.toXML(finalObject, {header: true, indent: '  '});
    return xml;
  }
}
exports.xmlGenerator = xmlgen;
