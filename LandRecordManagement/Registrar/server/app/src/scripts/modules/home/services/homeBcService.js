export default class BCService {
  constructor($http, $q) {
    this.HTTP = $http;
    this.Q = $q;
    this.bchost = "http://localhost:8000";
  }

  performAadharSearch(query) {
    var bcsrvc = this;
    var deferred = bcsrvc.Q.defer();
    let q = angular.copy(query);
    var queryObj = {
        'selector':{
        '$and': [
        {
          'source': 'ENTITY'
        }]
    }
  };

  for (var key in q) {
    if(q[key] !== '') {
      if(key === 'aadhar') {
        var obj = {};
        obj['SubEntities.3.ownerDetails.' + key] = q[key];
        queryObj['selector']['$and'].push(obj);
      }
    }
  }
  bcsrvc.HTTP({
    method: 'POST',
    url: bcsrvc.bchost + '/api/chaincodes/users/login?username=admin&password=adminpw&org=org1',
    headers: {
        'Content-Type': 'application/json'
    }
  }).then((result) => {
    if(result.data.status === 'OK') {
      bcsrvc.HTTP({
        method: 'GET',
        url: bcsrvc.bchost + '/api/chainwalker/getEntityFromCouch?queryString=' + JSON.stringify(queryObj) + '&modelName=test&access_token=' + result.data.access_token,
        headers: {
            'Content-Type': 'application/json'
        }
      }).then((result) => {
        deferred.resolve(result.data);
      }, (error) => {
        deferred.reject("Searching records failed: " + JSON.stringify(error));
      });
    }
  }, (error) => {
    deferred.reject("Searching records failed: " + JSON.stringify(error));
  });


  return deferred.promise;
  }

  submitTransferDetails(query) {
    var bcsrvc = this;

    var deferred = bcsrvc.Q.defer();
    bcsrvc.HTTP({
      method: 'POST',
      url: bcsrvc.bchost + '/api/chaincodes/users/login?username=admin&password=adminpw&org=org1',
      headers: {
          'Content-Type': 'application/json'
      }
    }).then((result) => {
      if(result.data.status === 'OK') {
        bcsrvc.HTTP({
          method: 'POST',
          url: bcsrvc.bchost + '/api/chainwalker/saledeedAppointment?modelName=test&access_token=' + result.data.access_token,
          headers: {
              'Content-Type': 'application/json'
          },
          data: query
        }).then((result) => {
          deferred.resolve(result.data);
        }, (error) => {
          deferred.reject("Transfer initiation failed: " + JSON.stringify(error));
        });
      }
    }, (error) => {
      deferred.reject("User not logged in: " + JSON.stringify(error));
    });


    return deferred.promise;
  }

  getRecord(pid) {
    var bcsrvc = this;

    var deferred = bcsrvc.Q.defer();
    bcsrvc.HTTP({
      method: 'POST',
      url: bcsrvc.bchost + '/api/chaincodes/users/login?username=admin&password=adminpw&org=org1',
      headers: {
          'Content-Type': 'application/json'
      }
    }).then((result) => {
      if(result.data.status === 'OK') {
        bcsrvc.HTTP({
          method: 'GET',
          url: bcsrvc.bchost + '/api/chainwalker/getEntity?modelName=test&access_token=' + result.data.access_token + '&entID=' + pid,
          headers: {
              'Content-Type': 'application/json'
          }
        }).then((result) => {
          deferred.resolve(result.data);
        }, (error) => {
          deferred.reject("fteching record failed: " + JSON.stringify(error));
        });
      }
    }, (error) => {
      deferred.reject("User not logged in: " + JSON.stringify(error));
    });


    return deferred.promise;
  }

  transferProperty(obj) {
    var bcsrvc = this;

    var deferred = bcsrvc.Q.defer();
    bcsrvc.HTTP({
      method: 'POST',
      url: bcsrvc.bchost + '/api/chaincodes/users/login?username=admin&password=adminpw&org=org1',
      headers: {
          'Content-Type': 'application/json'
      }
    }).then((result) => {
      if(result.data.status === 'OK') {
        bcsrvc.HTTP({
          method: 'POST',
          url: bcsrvc.bchost + '/api/chainwalker/registerSaledeed?modelName=test&access_token=' + result.data.access_token,
          headers: {
              'Content-Type': 'application/json'
          },
          data: obj
        }).then((result) => {
          deferred.resolve(result.data);
        }, (error) => {
          deferred.reject("Transfer failed: " + JSON.stringify(error));
        });
      }
    }, (error) => {
      deferred.reject("User not logged in: " + JSON.stringify(error));
    });


    return deferred.promise;
  }


}

BCService.$inject = ['$http', '$q']
