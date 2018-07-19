package common

import (
	"encoding/json"
	"github.com/op/go-logging"
	"strconv"
)

var myLogger = logging.MustGetLogger("CommonUtil")

func TrimEmptyObjects(entity map[string]interface{}) map[string]interface{} {
	var copySubEntities []interface{}
	for _, subEntity := range entity["SubEntities"].([]interface{}) {
		for subEntName, fieldsInSubEnt := range subEntity.(map[string]interface{}) {
			if len(fieldsInSubEnt.(map[string]interface{})) > 0 {
				var copyAttrs map[string]interface{}
				copyAttrs = make(map[string]interface{})
				for fieldName, fieldValue := range fieldsInSubEnt.(map[string]interface{}) {
					if fieldValue != "" {
						copyAttrs[fieldName] = fieldValue
					}
				}
				if len(copyAttrs) > 0 {
					subEntity.(map[string]interface{})[subEntName] = copyAttrs
					copySubEntities = append(copySubEntities, subEntity)
				}
			}
		}
	}
	entity["SubEntities"] = copySubEntities
	return entity
}

func MergeEntities(entity map[string]interface{}, entityDB map[string]interface{}) map[string]interface{} {
	subEntitiesInDB := entityDB["SubEntities"].([]interface{})
	for _, subEntities := range entity["SubEntities"].([]interface{}) {
		for subEntName, fieldsInSubEnt := range subEntities.(map[string]interface{}) {
			for fieldName, fieldValue := range fieldsInSubEnt.(map[string]interface{}) {
				subEntitiesInDB = mergeInEnt(subEntName, fieldName, fieldValue.(string), subEntitiesInDB)
			}
		}
	}
	entityDB["SubEntities"] = subEntitiesInDB
	return entityDB
}

func mergeInEnt(subEntName string, attr string, value string, subEntitiesInDB []interface{}) []interface{} {
	foundSubEntity := false
	for _, seInDB := range subEntitiesInDB {
		for subEntNameDB, fieldsInSubEnt := range seInDB.(map[string]interface{}) {
			if subEntNameDB == subEntName {
				foundSubEntity = true
				fieldsInSubEnt.(map[string]interface{})[attr] = value
				return subEntitiesInDB
			}
		}
	}
	if !foundSubEntity {
		seStr := "{\"" + subEntName + "\": {\"" + attr + "\":\"" + value + "\"}}"
		var se map[string]interface{}
		json.Unmarshal([]byte(seStr), &se)
		subEntitiesInDB = append(subEntitiesInDB, se)
	}
	return subEntitiesInDB
}

func MarshalToBytes(value interface{}) []byte {
	bytes, marshallErr := json.Marshal(value)
	if marshallErr != nil {
		myLogger.Error("Error in marshalling : ", value, marshallErr)
		return bytes
	}
	return bytes
}

func GetEntityAttrValue(entity map[string]interface{}, attrCode string, attrFld string) string {
	var value string
	subEntArr := entity["SubEntities"].([]interface{})
	var subEnt (map[string]interface{})
	if len(subEntArr) > 0 {
		for _, se := range subEntArr {
			tmpSubEnt := se.(map[string]interface{})
			if tmpSubEnt[attrCode] != nil {
				subEnt = tmpSubEnt
				subEntMap := subEnt[attrCode].(map[string]interface{})
				if subEntMap[attrFld] != nil {
					value = subEntMap[attrFld].(string)
				}
			}
		}
	}
	return value
}

func StringArrayContains(array []string, element string) bool {
	for _, ele := range array {
		if ele == element {
			return true
		}
	}
	return false
}

func GetFloatFromString(val string) float64 {
	floatVal, err := strconv.ParseFloat(val, 64)
	if err != nil {
		myLogger.Debugf("Error converting to float64 : ", val)
		return 0.0
	}
	return floatVal
}

func TrimQuotes(s string) string {
	if len(s) >= 2 {
		if s[0] == '"' && s[len(s)-1] == '"' {
			return s[1 : len(s)-1]
		}
	}
	return s
}
