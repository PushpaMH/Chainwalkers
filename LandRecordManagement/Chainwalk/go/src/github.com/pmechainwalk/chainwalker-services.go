package main

import (
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	"github.com/gbc/common"
	"github.com/gbc/db"
	"github.com/gbc/landrecord"
	"github.com/op/go-logging"
)

var myLogger = logging.MustGetLogger("Chainwalker-Service")

type ServicesChaincode struct {
}

func (t *ServicesChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

func (t *ServicesChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	db.STUB = stub
	function, args := stub.GetFunctionAndParameters()

	switch function {
		case "registerSaledeed":
			return returnResponse(landrecord.RegisterSaledeed(stub, args[0]))

		case "saledeedAppointment":
			return returnResponse(landrecord.SaledeedAppointment(stub, args[0]))

		case "addEntity":
			return returnResponse(landrecord.AddEntity(stub, args[0]))

		case "getEntity":
			entObj, errStr := landrecord.GetEntity(stub, args[0])
			return returnResponse(entObj, errStr)

		case "getEntityFromCouch":
			entObj, _ := db.TableStruct{Stub: db.STUB, TableName: "ENTITY", PrimaryKeys: []string{}}.GetQueryResult(args[0])
			return returnResponse(entObj, "")

		case "GetLandRecordsBy":
			resp, errStr := landrecord.GetLandRecordsBy(stub, args)
			return returnResponse(resp, errStr)

		case "GetLandRecordsTrail":
			resp, errStr := landrecord.GetLandRecordsTrail(stub, args[0])
			return returnResponse(resp, errStr)

		default:
			return shim.Error("Received unknown function invocation")
	}

}

func returnResponse(res interface{}, errStr string) pb.Response {
	if errStr != "" {
		return shim.Error(errStr)
	}
	return shim.Success(common.MarshalToBytes(res))
}

func main() {
	err := shim.Start(new(ServicesChaincode))
	if err != nil {
		myLogger.Errorf("Error starting ServicesChaincode: %s", err)
	}
}
