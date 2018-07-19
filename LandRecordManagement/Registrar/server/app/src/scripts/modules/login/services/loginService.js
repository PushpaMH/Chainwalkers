export default class LoginService {
  constructor($http, $q, $window) {
    this.HTTP = $http;
    this.Q = $q;
    this.WINDOW = $window;
    this.bchost = "http://localhost:8000";
    this.userInfo = null;
    this.init();
  }


  login(userName, password) {
    var loginSrvc = this;
    var deferred = loginSrvc.Q.defer();

    loginSrvc.HTTP({
      method: 'POST',
      url: loginSrvc.bchost + '/api/chaincodes/users/login?username=' + userName +'&password='+ password +  '&org=org1',
      headers: {
          'Content-Type': 'application/json'
      }
    }).then((result) => {
      if(result.data.status === 'OK') {
        loginSrvc.userInfo = {
          accessToken: result.data.access_token,
          userName: result.data.username,
          password: password,
          org: 'org1'
        };
        loginSrvc.WINDOW.sessionStorage["userInfo"] = JSON.stringify(loginSrvc.userInfo);
        deferred.resolve(result.data);
      }
      //deferred.reject(result.data);
    }, (error) => {
      deferred.reject(error);
    });
    return deferred.promise;
  }

  getUserInfo() {
    return this.userInfo;
  }

  isAuthenticated() {
    return this.userInfo !== null;
  }

  init() {
    if(this.WINDOW.sessionStorage["userInfo"]) {
      this.userInfo = JSON.parse(this.WINDOW.sessionStorage["userInfo"]);
    }
  }

}

LoginService.$inject = ['$http', '$q', '$window']
