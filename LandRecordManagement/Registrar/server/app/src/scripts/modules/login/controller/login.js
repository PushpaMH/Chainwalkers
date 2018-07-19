

export default class LoginController {
  constructor($timeout, $scope, loginsrvc, $mdDialog, $state) {
    this.SCOPE = $scope;
    this.LOGINSRVC = loginsrvc;
    this.to = $timeout;
    this.DIALOG = $mdDialog;
    this.state = $state;

    $scope.loginError = "Incorrect userName or password. Please Login again.";
    $scope.userName = "";
    $scope.password = "";
    $scope.showerror = false;
    $scope.mapModel = {
      title: 'hello'
    }

    $scope.callbacks = {
      aftersomething: function() {
        console.log('hello');
      }
    }
    //---- end of table configurations
  }

  login() {
    var login = this;
    if(login.SCOPE.userName === "" || login.SCOPE.userName == undefined) {
      login.showerror = true;
    }else {
      this.LOGINSRVC.login(login.SCOPE.userName, login.SCOPE.password).then((result) => {
        console.log("logged in");
        login.state.go("home", {"user": login.SCOPE.userName});
      }, (err) => {
        console.log("showerror");
        login.showerror = true;
      });
    }
  }

}

LoginController.$inject = ['$timeout', '$scope', 'loginsrvc', '$mdDialog', '$state'];
