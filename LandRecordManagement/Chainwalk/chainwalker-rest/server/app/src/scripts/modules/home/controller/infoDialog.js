
/*

This is a dialog/popup controller meant to show invoices/orders/errors/warnings

*/
export default class InfoDialogController {
  constructor($scope, $mdEditDialog, $mdDialog, data) {
    this.SCOPE = $scope;
    this.EDITDIALOG = $mdEditDialog;
    this.DIALOG = $mdDialog;
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    console.log(data);
    $scope.data = data;

    $scope.onDone= this.onDone.bind(this);


    //--- table configurations

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

    $scope.query = {
      order: 'id',
      limit: 5,
      page: 1
    };


  }

  onDone() {
    this.DIALOG.hide();
  }


}




InfoDialogController.$inject = ['$scope', '$mdEditDialog', '$mdDialog','data']
