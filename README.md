# Land Record Management using permissioned Blockchain solution



## Problem Statement / Motivation

1. The Revenue department of Government of Karnataka maintains land records in digital form  
2. The land records are important from a the perspective of   a) title of a land unit needs to be confirmed with one owner and    b) there needs to be a clear trail & record of all transactions done regarding the unit  
3. The land record are used by various other departments/stakeholders concerning a particular land e.g. registrar office for sale/registration, banks/co-operatives for farm loans, land acquisition department for village/town extension, roads, culverts etc.  
4. We need to have a trustworthy real-time record maintenance system capturing various attributes pertaining to a land  


## Current Scenario :

1. Record of rights, tenancy and crop (RTC) on a land in Karnataka is maintained on an online mutation application named BHOOMI  
2. Change to RTCs due to sale, partition, inheritance, pledge, release, government/court order etc. happen only on BHOOMI without any physical record keeping/human intervention  
3.  The mutation process is initiated at taluka level and then replicated at the state level to establish the record of rights (ROR) at a state level 
4. The state level information on land records is shared electronically with different stakeholders for various purposes –  
5.  Registration Department – The transaction to transfer the rights except inheritance happens in Sub Registrar Office. KAVERI – system of the Stamps and Registration department – talks electronically to BHOOMI. This has not only helped prospective buyers but has also gone a long way in enhancing the credibility of the registration department  
6.   Banks and Co-operative Institutions – Banks and co-operative institutions are enabled to electronically raise digitally signed request for pledge or release of any land. This has helped them to access the land records database for confirming ownership, extents owned by the farmer, other liabilities that farmer has and also monitor the status of requests raised by them  
7.  Land Acquiring Bodies – BHOOSWADEENA, an automated land acquisition system, talks electronically to BHOOMI, for various activities such as village/town extension, roads, culverts, reservoirs, canals, military camps, railways, industries etc., as needed by the government  
8. Survey Department – A pre-mutation sketch is mandatory and no transaction in sub-registrar offices can happen without the sketch. MOJANI, a software for meant for this purpose, if fully integrated with BHOOMI to achieve this objective  
9.  Others – Crop details of ROR are used by department of Economics and Statistics, Agriculture and horticulture. Forest department uses ROR data for protecting forest land  

## Proposed Solution : 
  
  The land records management should be done in a decentralised manner using permissioned blockchain where different LOB’s like Government, Banks, Muncipal and Electric departments etc can be the participants in the network. 

1. There will be a public portal available which is similar to BHOOMI, where any anonymous user can query and check the property details, property owner details and property ownership history.  
2. And there is a private portal , where user needs to be be logging in with their aadhar identity. Here they should be able to see all the properties they own. And they can begin the property transfer as well from this portal. This was we are eliminating the sub-registrar office. Where you apply for property transfer and wait for your queue etc.  
3. We are proposing a Kiosk centre and a ATM machine, where all the parties involved in the property transfer process will be present in person, the parties could be seller(the current owner ) , buyer, witness and bank representative, to assure that there is no encumbrance present on that property in case of any pending loans on that.  And this transaction can be recorded as well.

### What we are achieving : 

1. The proposed solution  is a decentralized system across LOBs which removes the need of maintaining the records separately.  
2. The transparency of blockchain network reduces the fraud on property ownership and duplicate owners. Only the person who is the owner could begin the property transfer using his aadhar based user created in blockchain. 
3. The transactions are immutable and thus increases the traceability of ownership on property. 
4. The delay in property transfer is reduced considerably.   
5. Every transactions happens in real time and all the parties involved in the network are updated instantly. 
6. In case of property transfer as all the other parties are also updated, the departments like electric, municipal etc can send the upcoming bills to the new owner.


## Steps to setup and run Land Record Management System

This setup is tested on MAC OSX. For other OS please follow the similar process.

### Prerequisites:
  1. Download docker and docker-compose for MAC
  2. install Golang and setup the GOPATH (http://sourabhbajaj.com/mac-setup/Go/README.html)
  3. install node (v6.10.3) and npm
  4. install ipfs for MAC (https://ipfs.io/docs/install/)

### Steps to start blockchain network and application servers:
  1. Go to the github repo Chainwalkers and download the zip. Unzip the file.
  2. open the terminal and cd to the LandRecordsmanagement/chainwalk/chainwalker-rest/artifacts folder run:
      rm -rf /tmp/fabric-client-kvs
      docker-compose rm
      docker-compose up
  3. open another terminal tab and run:  'ipfs daemon'
  4. In a new terminal tab, cd to LandRecordsmanagement/chainwalk/chainwalker-rest folder and run:
      npm install
      once that is completed, run node . (it starts one server running at localhost:8000)
  5. In a new terminal tab, cd to LandRecordsmanagement/Registrar folder and run:
      npm install
      once that is completed, cd to server folder and run node . (It starts one server for registrar portal at localhost:9000)

### Steps to run the scenario:

  1. In the browser, open http://localhost:8000/explorer. It opens up the Swagger-UI having REST APIs exposed for the application.
  2. POST /api/chaincodes/users/login using parameters: admin adminpw org1 and one access token is generated. Set that access token at the top.
  3. POST /api/chainwalker/chaincode/createChannel using parameter: mychannel
  4. POST /api/chainwalker/chaincode/joinChannel using parameter: mychannel
  5. POST /api/chaincodes/deploy using the request given in the sample request.
     This deploys a model named test on Blockchain network.
  6. For adding records into the BC network for the deployed model:  POST /api/chainwalker/addEntity. using model name as test  and the sample requests are given in the chainwalk/sample_json folder. Use sample00, sample01 and sample02 to add three records.
  7. As per the records added, we need to register one user into the BC network. POST /api/chaincodes/admin/registeruser using
     { “username”: “346891078190",“password”: “pwd”} and org1.
  8. In the browser, open http://localhost:8000 and u can see a Land Records portal having capability for searching land records using the area details, map or the aadhar number of the owner. (take the help of the data added)
  9. In the browser, open http://localhost:9000 and login with the 346891078190 and pwd. You will see the properties you are owning. You can click begin transfer and after filling in all the details, an appointment token is generated. Copy it for further use.
  10. Open http://localhost:9000/#!/deed and put the token received earlier. You will be prompted to a screen which resembles to the kiosk we are proposing in the solution. fill in the details of the buyer and click TRANSFER. The property will be transferred to the concerned person.
  11. Open  http://localhost:8000 and search for the property by the Aadhar number of the person whom you transferred the property in the previous step. You will see the newly transferred property and by clicking on the history, you can see the details of the previous owners.
