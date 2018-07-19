export default class PTCOntroller {
  constructor($scope, bcSrvc, $stateParams, $mdDialog) {
    this.SCOPE = $scope;
    this.BCSRVC = bcSrvc;
    this.pid = $stateParams.pid;
    this.getRecord($stateParams.pid);
    this.DIALOG = $mdDialog;
    this.SCOPE.trreq = {};
  }

  getRecord(pid) {
    var pt = this;
    pt.BCSRVC.getRecord(pid).then((result) => {
      pt.record = result;
    }, err => {
      showAlert('fetching property record failed');
    })
  }

  updateRecord() {
    var tc = this;

      var obj = {
          "EntId": tc.pid,
            "deedDetails": {
                "deedDate": tc.SCOPE.trreq.deeddate,
                "prevOwnerId": tc.record.SubEntities[3].ownerDetails.aadhar,
                "regLocation": tc.SCOPE.trreq.regloc
              },
              "ownerDetails": {
                "fname": tc.SCOPE.trreq.fname,
                "lname": tc.SCOPE.trreq.lname,
                "aadhar": tc.SCOPE.trreq.aadhar,
                "pan": tc.SCOPE.trreq.pan,
                "mobile": tc.SCOPE.trreq.mob
              }
      };

      tc.BCSRVC.transferProperty(obj).then(result => {
        tc.showAlert('successfully transferred property');
      }, err => {
        tc.showAlert('transfer failed');
      })
  }

  showAlert(text) {
    var tc = this;
    tc.DIALOG.show(
     tc.DIALOG.alert()
       .parent(angular.element(document.querySelector('div.main')))
       .clickOutsideToClose(true)
       .title('Alert!')
       .textContent(text)
       .ariaLabel('Alert Dialog Demo')
       .ok('Okay')
   );
  }
}

PTCOntroller.$inject = ['$scope', 'bcSrvc', '$stateParams', '$mdDialog']
