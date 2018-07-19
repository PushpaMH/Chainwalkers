package landrecord

import(
  "github.com/hyperledger/fabric/core/chaincode/shim"
  "encoding/json"
  "github.com/gbc/db"
  "github.com/op/go-logging"
  "bytes"
  "github.com/gbc/common"
  "fmt"
  "strings"
)

type SearchBy struct {
	Key string
	Value  string
}

var myLogger = logging.MustGetLogger("LandRecords")

func GetLandRecordsBy(stub shim.ChaincodeStubInterface, args []string)([]string, string){
  var searchBy []SearchBy
  err := json.Unmarshal([]byte(string(args[0])), &searchBy)
  if err != nil {
    myLogger.Debugf("Error is :", err)
  }

  var buffer bytes.Buffer
  buffer.WriteString("{\"selector\" : {   \"$and\" : [ ")
  buffer.WriteString("{\"source\":\"" +  db.LANDRECORD_DB + "\"}")

  for _, criteria := range searchBy {
    buffer.WriteString(",{\"SubEntities." + criteria.Key + "\":\"" +  criteria.Value + "\"}")
  }

  buffer.WriteString("]}}")
  queryResp, _ := db.TableStruct{Stub: db.STUB, TableName:db.LANDRECORD_DB, PrimaryKeys: []string{}}.GetQueryResult(buffer.String())
  return queryResp, ""
}


func GetLandRecordsTrail(stub shim.ChaincodeStubInterface, propertyId string)([]string, string){
  recHistory, _ := db.TableStruct{ Stub: db.STUB, TableName:db.LANDRECORD_DB, PrimaryKeys: []string{propertyId} }.GetTrail()
  return recHistory, ""
}


func RegisterSaledeed(stub shim.ChaincodeStubInterface, saledeedStr string)(map[string]interface{}, string){
  var saledeed map[string]interface{}
  var errStr string
  err := json.Unmarshal([]byte(saledeedStr), &saledeed)
  if err != nil{
    errStr := fmt.Sprintf("ERROR in parsing input:", err, saledeedStr)
    return nil,errStr
  }

  rec, _ := db.TableStruct{Stub: db.STUB, TableName:db.LANDRECORD_DB, PrimaryKeys: []string{saledeed["EntId"].(string)}}.Get()
  if rec==""{
    errStr = fmt.Sprintf("Invalid Property ID. Please provide the valid one.",)
    return nil,errStr
  }

  var landrecord map[string]interface{}
  err = json.Unmarshal([]byte(rec), &landrecord)
  if err != nil{
    errStr := fmt.Sprintf("ERROR in parsing input:", err, landrecord)
    return nil,errStr
  }
  subEntities := landrecord["SubEntities"].([]interface{})
  subEntities[1].(map[string]interface{})["encumbrance"].(map[string]interface{})["monetaryDues"] = "YES"
  subEntities[2].(map[string]interface{})["deedDetails"] = saledeed["deedDetails"]
  subEntities[3].(map[string]interface{})["ownerDetails"] = saledeed["ownerDetails"]
  subEntities[4].(map[string]interface{})["saleDeedRequest"].(map[string]interface{})["buyername"] = ""
  subEntities[4].(map[string]interface{})["saleDeedRequest"].(map[string]interface{})["witness"] = ""
  subEntities[4].(map[string]interface{})["saleDeedRequest"].(map[string]interface{})["dealdate"] = ""
  subEntities[4].(map[string]interface{})["saleDeedRequest"].(map[string]interface{})["dealLoc"] = ""


  // subEntities[2] = saledeed["deedDetails"]
  // subEntities[3] = saledeed["ownerDetails"]
  landrecord["SubEntities"] = subEntities

  myLogger.Debugf("landrecord -> ", landrecord)
  return UpdateEntity(stub, string(common.MarshalToBytes(landrecord)))
}


func SaledeedAppointment(stub shim.ChaincodeStubInterface, saledeedStr string)(string, string){
  var saledeed map[string]interface{}
  var errStr string
  err := json.Unmarshal([]byte(saledeedStr), &saledeed)
  if err != nil{
    errStr := fmt.Sprintf("ERROR in parsing input:", err, saledeedStr)
    return "",errStr
  }

  deedDetails := saledeed["deedDetails"].(map[string]interface{})
  var isEncumranceClear bool
  isEncumranceClear, errStr = VerifyEncumbrance(stub, saledeed["EntId"].(string), deedDetails["prevOwnerId"].(string))
  if !isEncumranceClear || errStr != "" {
    return "", errStr
  }

  rec, _ := db.TableStruct{Stub: db.STUB, TableName:db.LANDRECORD_DB, PrimaryKeys: []string{saledeed["EntId"].(string)}}.Get()

  if rec==""{
    errStr = fmt.Sprintf("Invalid Property ID. Please provide the valid one.",)
    return "",errStr
  }

  var landrecord map[string]interface{}
  err = json.Unmarshal([]byte(rec), &landrecord)
  if err != nil{
    errStr := fmt.Sprintf("ERROR in parsing input:", err, landrecord)
    return "",errStr
  }
  subEntities := landrecord["SubEntities"].([]interface{})

  subEntities[4].(map[string]interface{})["saleDeedRequest"] = saledeed["saleDeedRequest"]
  landrecord["SubEntities"] = subEntities

  UpdateEntity(stub, string(common.MarshalToBytes(landrecord)))
  saleDeedRequest:= saledeed["saleDeedRequest"].(map[string]interface{})
  dealdate:= saleDeedRequest["dealdate"].(string)
  dealLoc:= saleDeedRequest["dealLoc"].(string)
  res_str:= fmt.Sprintf("Your apppointment has been booked on %s and for %s. Your apppointment token is ABXYC123Z-pid-%s", dealdate, dealLoc, saledeed["EntId"].(string))
  return res_str, ""
}

func VerifyEncumbrance(stub shim.ChaincodeStubInterface, propertyId string, ownerAadhaar string)(bool, string){
  rec, _ := db.TableStruct{Stub: db.STUB, TableName:db.LANDRECORD_DB, PrimaryKeys: []string{propertyId}}.Get()

  if rec==""{
    errStr := fmt.Sprintf("Invalid Property ID. Please provide the valid one.",)
    return false,errStr
  }

  var landrecord map[string]interface{}
  err := json.Unmarshal([]byte(rec), &landrecord)
  if err != nil{
    errStr := fmt.Sprintf("ERROR in parsing input:", err, landrecord)
    return false,errStr
  }

  subEntities := landrecord["SubEntities"].([]interface{})
  subEle1 := subEntities[1].(map[string]interface{})
  encumbrance := subEle1["encumbrance"].(map[string]interface{})

  if(strings.ToUpper((encumbrance["monetaryDues"].(string))) != "NO"){
    return false, "Failed encumbrance. Property has some monetary dues."
  }

  if(strings.ToUpper(encumbrance["legalLiability"].(string)) != "NO"){
    return false, "Failed encumbrance. Legal liability exists."
  }

  subEle3 := subEntities[3].(map[string]interface{})
  ownerDetails := subEle3["ownerDetails"].(map[string]interface{})

  if(strings.ToUpper(ownerAadhaar) != strings.ToUpper(ownerDetails["aadhar"].(string))){
    return false, "Failed encumbrance. Invalid ownership."
  }

  return true, ""
}
