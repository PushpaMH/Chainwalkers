export default class SearchpanelService {
  constructor($http, $q) {
    this.HTTP = $http;
    this.Q = $q;
    //search query
    this.recordsSearchQuery = {
      district: '',
      taluk: '',
      hobli: '',
      village: '',
      surveyNo: '',
      pid: '',
      aadhar: '',
      zip: '',
      lastname: ''
    };
  }



  performSearchByLocation(query) {
    var spSrvc = this;
    var deferred = spSrvc.Q.defer();
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
      if(key !== 'pid') {
        var obj = {};
        obj['SubEntities.0.bhoomiDetails.' + key] = q[key];
        queryObj['selector']['$and'].push(obj);
      } else {
        queryObj['selector']['$and'].push({
          'EntId' : q[key]
        })
      }
    }
  }
  spSrvc.HTTP({
    method: 'POST',
    url: '/api/chaincodes/users/login?username=admin&password=adminpw&org=org1',
    headers: {
        'Content-Type': 'application/json'
    }
  }).then((result) => {
    if(result.data.status === 'OK') {
      spSrvc.HTTP({
        method: 'GET',
        url: '/api/chainwalker/getEntityFromCouch?queryString=' + JSON.stringify(queryObj) + '&modelName=test&access_token=' + result.data.access_token,
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

  performLastnameSearch(query) {
    var spSrvc = this;
    var deferred = spSrvc.Q.defer();
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
      if(key === 'lastname') {
        var obj = {};
        obj['SubEntities.3.ownerDetails.lname'] = q[key];
        queryObj['selector']['$and'].push(obj);
      }

      if (key === 'zip') {
        var obj = {};
        obj['SubEntities.0.bhoomiDetails.pincode'] = q[key];
        queryObj['selector']['$and'].push(obj);
      }
    }
  }
  spSrvc.HTTP({
    method: 'POST',
    url: '/api/chaincodes/users/login?username=admin&password=adminpw&org=org1',
    headers: {
        'Content-Type': 'application/json'
    }
  }).then((result) => {
    if(result.data.status === 'OK') {
      spSrvc.HTTP({
        method: 'GET',
        url: '/api/chainwalker/getEntityFromCouch?queryString=' + JSON.stringify(queryObj) + '&modelName=test&access_token=' + result.data.access_token,
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

  performAadharSearch(query) {
    var spSrvc = this;
    var deferred = spSrvc.Q.defer();
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
  spSrvc.HTTP({
    method: 'POST',
    url: '/api/chaincodes/users/login?username=admin&password=adminpw&org=org1',
    headers: {
        'Content-Type': 'application/json'
    }
  }).then((result) => {
    if(result.data.status === 'OK') {
      spSrvc.HTTP({
        method: 'GET',
        url: '/api/chainwalker/getEntityFromCouch?queryString=' + JSON.stringify(queryObj) + '&modelName=test&access_token=' + result.data.access_token,
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

  getHistory(pid){
    var spSrvc = this;
    var deferred = spSrvc.Q.defer();
    spSrvc.HTTP({
      method: 'POST',
      url: '/api/chaincodes/users/login?username=admin&password=adminpw&org=org1',
      headers: {
          'Content-Type': 'application/json'
      }
    }).then((result) => {
      if(result.data.status === 'OK') {
        spSrvc.HTTP({
          method: 'GET',
          url: '/api/chainwalker/getLandRecordsTrail?propertyId=' + pid + '&modelName=test&access_token=' + result.data.access_token,
          headers: {
              'Content-Type': 'application/json'
          }
        }).then((result) => {
          deferred.resolve(result.data);
        }, (error) => {
          deferred.reject("Searching history failed: " + JSON.stringify(error));
        });
      }
    }, (error) => {
      deferred.reject("Searching history failed: " + JSON.stringify(error));
    });


  return deferred.promise;
  }
}

SearchpanelService.$inject = ['$http', '$q']
