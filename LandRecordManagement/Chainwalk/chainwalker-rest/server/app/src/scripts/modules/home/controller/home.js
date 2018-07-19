

export default class HomeController {
  constructor($timeout, $scope, searchsrvc, $mdDialog) {
    this.SCOPE = $scope;
    this.SEARCHSRVC = searchsrvc;
    this.to = $timeout;
    this.DIALOG = $mdDialog;

    this.showprogress = false;
    this.pdeterminate = 0;

    $scope.recordsSearchQuery = searchsrvc.recordsSearchQuery;
    $scope.recordsResultsByAadhar = [];
    $scope.recordsResultsByloc = [];
    $scope.recordsResultsByzipnLastname = [];

    $scope.mapModel = {
      title: 'hello'
    }

    $scope.callbacks = {
      aftersomething: function() {
        console.log('hello');
      }
    }

    //---- the table configurations
    //
    $scope.options = {
      rowSelection: false,
      multiSelect: false,
      autoSelect: false,
      decapitate: false,
      largeEditDialog: false,
      boundaryLinks: false,
      limitSelect: true,
      pageSelect: true
    };
    //
    $scope.query = {
      order: 'Value.invoice.invoice_date',
      limit: 10,
      page: 1
    };
    //
    $scope.locLimitOption = [10, {
      label: 'All',
      value: () => {
        return $scope.recordsResultsByloc.length;
      }
    }];

    $scope.aalimitOptions = [10, {
      label: 'All',
      value: () => {
        return $scope.recordsResultsByAadhar.length;
      }
    }];

    $scope.lzlimitOptions = [10, {
      label: 'All',
      value: () => {
        return $scope.recordsResultsByzipnLastname.length;
      }
    }];

    //---- end of table configurations

  }

  performSearchByLocation() {
    var home = this;
    home.showprogress = true;
    home.pdeterminate = 60;
    //empty other search panel fields;
    this.SCOPE.recordsSearchQuery.aadhar = '';
    this.SCOPE.recordsSearchQuery.lastname = '';
    this.SCOPE.recordsSearchQuery.zip = '';
    this.SEARCHSRVC.performSearchByLocation(this.SCOPE.recordsSearchQuery).then((result) => {
      home.pdeterminate = 100;
      home.to(() => {
        home.showprogress = false;
      }, 100);
      if(!result.queryResult) {
        home.showAlert('no records found');
        return;
      }
      home.SCOPE.recordsResultsByloc = [];
      result.queryResult.forEach(result => {
        home.SCOPE.recordsResultsByloc.push(JSON.parse(result));
      });
    }, (err) => {
      home.pdeterminate = 100;
      home.to(() => {
        home.showprogress = false;
      }, 100);
      home.showAlert('fetching records failed');
    });
  }

  performAadharSearch() {
    var home = this;
    home.showprogress = true;
    home.pdeterminate = 60;
    this.SEARCHSRVC.performAadharSearch(this.SCOPE.recordsSearchQuery).then((result) => {
      home.pdeterminate = 100;
      home.to(() => {
        home.showprogress = false;
      }, 100);
      if(!result.queryResult) {
        home.showAlert('no records found');
        return;
      }
      home.SCOPE.recordsResultsByAadhar = [];
      result.queryResult.forEach(result => {
        home.SCOPE.recordsResultsByAadhar.push(JSON.parse(result));
      });
    }, (err) => {
      home.pdeterminate = 100;
      home.to(() => {
        home.showprogress = false;
      }, 100);
      home.showAlert('fetching records failed');
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


  openHistoryDialog(ev, record) {
    let home = this;
    this.SEARCHSRVC.getHistory(record.EntId).then((result) => {
      if(!result.queryResult) {
        home.showAlert('no history found');
        return;
      }
      home.SCOPE.historyRecords = [];
      result.queryResult.forEach(result => {
        home.SCOPE.historyRecords.push(JSON.parse(result));
      });

      home.DIALOG.show({
        controller: 'InfoCtrl',
        template: require('../templates/info-dialog.tmpl.html'),
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:false,
        escapeToClose: false,
        openFrom: ev.target,
        closeTo: ev.target,
        locals: {
          data : {
            history: home.SCOPE.historyRecords
          }
        }
      })
      .then(() => {
        console.log("info dialog closed");
      },() => {
        console.log('You cancelled the info dialog.');
      });

    }, (err) => {
      home.showAlert('fetching history failed');
    });

  }

  openMapDialog(ev, record) {
    let home = this;
    home.DIALOG.show({
      controller: 'MapCtrl',
      template: require('../templates/map-dialog.tmpl.html'),
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:false,
      escapeToClose: false,
      openFrom: ev.target,
      closeTo: ev.target,
      locals: {
        data : {
          record: record
        }
      }
    })
    .then(() => {
      console.log("info dialog closed");
    },() => {
      console.log('You cancelled the info dialog.');
    });
  }


}

HomeController.$inject = ['$timeout', '$scope', 'searchsrvc', '$mdDialog'];
