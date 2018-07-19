package db

import(
  	"github.com/hyperledger/fabric/core/chaincode/shim"
)

var STUB shim.ChaincodeStubInterface
var LANDRECORD_DB = "ENTITY"

type TableStruct struct{
  Stub         shim.ChaincodeStubInterface
	TableName    string
  PrimaryKeys   []string
  Data         interface{}
}

type Table interface {
	Add()(error)
	Update()(error)
  Get()(string, error)
  Delete()(error)
  GetAll()(map[string]string, error)
  GetHistory()(error)
  GetQueryResult(string)(string, error)
}
