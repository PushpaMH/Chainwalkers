/*
Copyright IBM Corp. 2016 All Rights Reserved.
Licensed under the IBM India Pvt Ltd, Version 1.0 (the "License");
*/

package landrecord

import (
	"github.com/hyperledger/fabric/core/chaincode/shim"
	"encoding/json"
	"github.com/gbc/common"
	"fmt"
	"github.com/gbc/db"
)

func AddEntity(stub shim.ChaincodeStubInterface, entityStr string) (map[string]interface{}, string) {
	var entity map[string]interface{}
	myLogger.Debugf("Adding entity . . . . . .")
	err := json.Unmarshal([]byte(entityStr), &entity)
	if err != nil{
		errStr := fmt.Sprintf("ERROR in parsing input:", err, entityStr)
		return nil,errStr
	}

  if entity["EntId"].(string)=="undefined" || entity["EntId"].(string)==""{
		entity["EntId"] = "ENT"+stub.GetTxID()
	}

	// Add the source details
	entity["source"] = db.LANDRECORD_DB
	myLogger.Debugf("After entity - ", entity)

	// Add entity
	db.TableStruct{ Stub: db.STUB, TableName:db.LANDRECORD_DB, PrimaryKeys: []string{entity["EntId"].(string)}, Data:entity}.Add()
	// db.SetWSValue(db.LANDRECORD_DB, []string{entity["EntId"].(string)}, string(common.MarshalToBytes(entity)))

	return entity, ""
}

func UpdateEntity(stub shim.ChaincodeStubInterface, entityStr string) (map[string]interface{}, string) {
	var entity map[string]interface{}
	err := json.Unmarshal([]byte(entityStr), &entity)
	if err != nil{
		errStr := fmt.Sprintf("ERROR in parsing input:", err)
		return nil, errStr
	}

	// entRecordFromDB := db.GetWSValue(db.LANDRECORD_DB, []string{entity["EntId"].(string)})
	// entity, _ := db.TableStruct{ Stub: db.STUB, TableName:db.LANDRECORD_DB, PrimaryKeys: []string{entity["EntId"].(string)}, Data:entity}.Add()
	entRecordFromDB, _ := db.TableStruct{Stub: db.STUB, TableName:db.LANDRECORD_DB, PrimaryKeys: []string{entity["EntId"].(string)}}.Get()

	var entityDB map[string]interface{}
	entFounderr := json.Unmarshal([]byte(entRecordFromDB), &entityDB)
	if entFounderr != nil{
		return nil, "Entity " + entity["EntId"].(string) + " not found to update."
	}

	mergedEnt := common.MergeEntities(entity, entityDB)
	db.TableStruct{ Stub: db.STUB, TableName:db.LANDRECORD_DB, PrimaryKeys: []string{entity["EntId"].(string)}, Data:mergedEnt}.Add()
	// db.SetWSValue(db.LANDRECORD_DB, []string{entity["EntId"].(string)}, string(common.MarshalToBytes(mergedEnt)))

	return mergedEnt, ""
}


func GetEntity(stub shim.ChaincodeStubInterface, entId string) (map[string]interface{}, string) {
		entRecordFromDB, _ := db.TableStruct{Stub: db.STUB, TableName:db.LANDRECORD_DB, PrimaryKeys: []string{entId}}.Get()
		var errStr string
		var entity map[string]interface{}
		err := json.Unmarshal([]byte(entRecordFromDB), &entity)
		if err != nil{
			errStr = "ENTITY NOT FOUND : No entity found by ID " + entId
			myLogger.Debugf("ERROR in parsing entity " + entRecordFromDB)
		}
	return entity, errStr
}
