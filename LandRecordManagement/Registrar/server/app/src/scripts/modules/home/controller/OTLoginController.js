export default class OTLoginCOntroller {
  constructor($scope, $state) {
    var ot = this;
    ot.STATE = $state;
    ot.SCOPE = $scope;
    ot.SCOPE.otlogin = '';
  }

  proceedtoreg() {
    var ot = this;
    if(ot.SCOPE.otlogin !== '') {
      console.log('hi');
      ot.STATE.go("transfer", {"pid": ot.SCOPE.otlogin.split('-')[2]});
    }
  }
}

OTLoginCOntroller.$inject = ['$scope', '$state']
