

export default class HomeController {
  constructor($timeout, $scope, bcSrvc, $mdDialog, $stateParams) {
    this.SCOPE = $scope;
    this.BCSRVC = bcSrvc;
    this.to = $timeout;
    this.DIALOG = $mdDialog;
    this.SCOPE.recordsSearchQuery = {
      aadhar: $stateParams.user
    }
    this.performAadharSearch();
    this.SCOPE.showTform = false;
    this.SCOPE.disableButton = false;

    this.SCOPE.sdreq = {
      buyer: '',
      witness: '',
      dl: '',
      dd: ''
    }

  }

  performAadharSearch() {
    var home = this;
    this.BCSRVC.performAadharSearch(this.SCOPE.recordsSearchQuery).then((result) => {

      if(!result.queryResult) {
        home.showAlert('no records found');
        return;
      }
      home.SCOPE.recordsResultsByAadhar = [];
      result.queryResult.forEach(result => {
        home.SCOPE.recordsResultsByAadhar.push(JSON.parse(result));
      });
    }, (err) => {
      home.showAlert('fetching records failed');
    });
  }

  initiateTransfer(record) {
    this.SCOPE.showTform = true;
    this.currentRecord = record;
  }

  submitTransferData() {
    var home = this;
    var record = this.currentRecord;
    var query = {
    "EntId": record.EntId,
    "deedDetails": {
        "deedDate": record.SubEntities[2].deedDetails.deedDate,
        "prevOwnerId": record.SubEntities[3].ownerDetails.aadhar,
        "regLocation": record.SubEntities[2].deedDetails.regLocation
      },
      "saleDeedRequest": {
        "buyername": home.SCOPE.sdreq.buyer,
        "witness": home.SCOPE.sdreq.witness,
        "dealdate": home.SCOPE.sdreq.dd,
        "dealLoc": home.SCOPE.sdreq.dl
      }
    };
    this.BCSRVC.submitTransferDetails(query).then((result) => {
      this.SCOPE.showTform = false;
      home.showAlert(result.bc_response);
      home.SCOPE.disableButton = true;
    }, (err) => {
      home.showAlert('could not submit details - ' + "Failed encumbrance. Property has some monetary dues.");
    });
  }

  showAlert(text) {
    var home = this;
    home.DIALOG.show(
     home.DIALOG.alert()
       .parent(angular.element(document.querySelector('div.main')))
       .clickOutsideToClose(true)
       .title('Alert!')
       .textContent(text)
       .ariaLabel('Alert Dialog Demo')
       .ok('Okay')
   );
  }



}

HomeController.$inject = ['$timeout', '$scope', 'bcSrvc', '$mdDialog', '$stateParams'];
