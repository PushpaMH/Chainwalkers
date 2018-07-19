package db

import (
	"bytes"
	"errors"
	"fmt"
	"github.com/gbc/common"
	"github.com/op/go-logging"
	"strings"
)

var myLogger = logging.MustGetLogger("DatabaseImpl")

func (tab TableStruct) Add() error {
	STUB = tab.Stub
	compositeKey, _ := tab.Stub.CreateCompositeKey(tab.TableName, tab.PrimaryKeys)
	return AddToLedger(compositeKey, string(common.MarshalToBytes(tab.Data)))
}

func AddToLedger(key string, value string) error {
	// myLogger.Debugf("***************************************************************")
	// myLogger.Debugf("Store to ledger :  "+ key , value)
	// myLogger.Debugf("***************************************************************")
	err := STUB.PutState(key, []byte(value))
	if err != nil {
		myLogger.Errorf("Error in storing world state : ", err)
		return err
	}
	return nil
}

func (tab TableStruct) Update() error {
	return nil
}

func (tab TableStruct) Get() (string, error) {
	compositeKey, _ := tab.Stub.CreateCompositeKey(tab.TableName, tab.PrimaryKeys)
	data, err := tab.Stub.GetState(compositeKey)

	// myLogger.Debugf("***************************************************************")
	// myLogger.Debugf("Get from ledger: " + compositeKey)
	// myLogger.Debugf("Value : " + string(data))
	// myLogger.Debugf("***************************************************************")

	if err != nil {
		myLogger.Errorf("Error getting world state : ", err)
		return "", err
	}
	return string(data), nil
}

func (tab TableStruct) GetQueryResult(queryString string) ([]string, error) {
  fmt.Println("GetQueryResultForQueryString() : getQueryResultForQueryString queryString:\n%s\n", queryString)

	resultsIterator, err := tab.Stub.GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryRecords
	// var buffer bytes.Buffer
	// buffer.WriteString("[")
  //
	// bArrayMemberAlreadyWritten := false
	// for resultsIterator.HasNext() {
	// 	queryResponse, err := resultsIterator.Next()
	// 	if err != nil {
	// 		return "", err
	// 	}
	// 	// Add a comma before array members, suppress it for the first array member
	// 	if bArrayMemberAlreadyWritten == true {
	// 		buffer.WriteString(",")
	// 	}
	// 	buffer.WriteString("{\"Key\":")
	// 	buffer.WriteString("\"")
	// 	buffer.WriteString(queryResponse.Key)
	// 	buffer.WriteString("\"")
  //
	// 	buffer.WriteString(", \"Record\":")
	// 	// Record is a JSON object, so we write as-is
	// 	buffer.WriteString(string(queryResponse.Value))
	// 	buffer.WriteString("}")
	// 	bArrayMemberAlreadyWritten = true
	// }
	// buffer.WriteString("]")
	// fmt.Println("GetQueryResultForQueryString(): getQueryResultForQueryString queryResult:\n%s\n", buffer.String())

	// return buffer.Bytes(), nil


	// var rowsMap map[string]string
	// rowsMap = make(map[string]string)

	var resArr []string
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		// trimmedKey := strings.Replace(queryResponse.Key, "\u0000", "", -1)
		// rowsMap[trimmedKey] = string(queryResponse.Value)
		resArr = append(resArr, string(queryResponse.Value))
	}
  return resArr, nil
}

func (tab TableStruct) GetAll() (map[string]string, error) {
	keysIter, _ := tab.Stub.GetStateByPartialCompositeKey(tab.TableName, tab.PrimaryKeys)
	defer keysIter.Close()
	var rowsMap map[string]string
	rowsMap = make(map[string]string)

	for keysIter.HasNext() {
		resp, iterErr := keysIter.Next()
		if iterErr != nil {
			return nil, errors.New(fmt.Sprintf("keys operation failed. Error accessing state: %s", iterErr))
		}

		dataVal := string(resp.Value)
		dataVal = strings.Replace(dataVal, "\\", "", -1)
		if len(dataVal) > 2 && string(dataVal[0]) == "\"" {
			dataVal = dataVal[1:(len(dataVal) - 1)]
		}

		rowsMap[string(resp.Key)] = dataVal
	}
	// myLogger.Debugf("..................................................")
	// myLogger.Debugf("Get all Data: ")
	// myLogger.Debugf("Key - ", tab.TableName, tab.PrimaryKeys)
	// myLogger.Debugf("Val - ", rowsMap)
	// myLogger.Debugf("..................................................")
	return rowsMap, nil
}

func (tab TableStruct) Delete() error {
	compositeKey, _ := tab.Stub.CreateCompositeKey(tab.TableName, tab.PrimaryKeys)
	return DeleteFromLedger(compositeKey)
}

func DeleteFromLedger(key string) error {
	// myLogger.Debugf("..................................................")
	// myLogger.Debugf("Delete Key: ")
	// myLogger.Debugf("Key - ", key)
	// myLogger.Debugf("..................................................")
	STUB.DelState(key)
	return nil
}

func (tab TableStruct) GetHistory() (string, error) {
	compositeKey, _ := tab.Stub.CreateCompositeKey(tab.TableName, tab.PrimaryKeys)
	keysIter, err := tab.Stub.GetHistoryForKey(compositeKey)
	if err != nil {
		myLogger.Debugf("query operation failed. Error accessing history: ", err)
		return "", errors.New(fmt.Sprintf("query operation failed. Error accessing state: %s", err))
	}
	defer keysIter.Close()

	var buffer bytes.Buffer
	for keysIter.HasNext() {
		resp, iterErr := keysIter.Next()
		if iterErr != nil {
			myLogger.Debugf("query operation failed. Error accessing history: ", err)
			return "", errors.New(fmt.Sprintf("query operation failed. Error accessing state: %s", err))
		}

		dataVal := string(resp.Value)
		dataVal = strings.Replace(dataVal, "\\", "", -1)
		if len(dataVal) > 2 && string(dataVal[0]) == "\"" {
			dataVal = dataVal[1:(len(dataVal) - 1)]
		}
		buffer.WriteString(dataVal)
	}
	myLogger.Debugf("..................................................")
	myLogger.Debugf("Get History - ")
	myLogger.Debugf("Key : ", compositeKey)
	myLogger.Debugf("Value : ", buffer.String())
	myLogger.Debugf("..................................................")
	return buffer.String(), nil
}


func (tab TableStruct) GetTrail() ([]string, error) {
	var recHistoryArr []string
	compositeKey, _ := tab.Stub.CreateCompositeKey(tab.TableName, tab.PrimaryKeys)
	keysIter, err := tab.Stub.GetHistoryForKey(compositeKey)
	if err != nil {
		myLogger.Debugf("query operation failed. Error accessing history: ", err)
		return nil, errors.New(fmt.Sprintf("query operation failed. Error accessing state: %s", err))
	}
	defer keysIter.Close()

	for keysIter.HasNext() {
		resp, iterErr := keysIter.Next()
		if iterErr != nil {
			myLogger.Debugf("query operation failed. Error accessing history: ", err)
			return nil, errors.New(fmt.Sprintf("query operation failed. Error accessing state: %s", err))
		}
		recHistoryArr = append(recHistoryArr, string(resp.Value))
	}
	myLogger.Debugf("..................................................")
	myLogger.Debugf("Get History - ", compositeKey, recHistoryArr)
	myLogger.Debugf("..................................................")
	return recHistoryArr, nil
}
