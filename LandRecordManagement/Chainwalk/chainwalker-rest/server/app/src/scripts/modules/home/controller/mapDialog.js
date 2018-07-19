
/*

This is a dialog/popup controller meant to show invoices/orders/errors/warnings

*/
export default class MapDialogController {
  constructor($scope, $mdDialog, data, $timeout) {
    this.SCOPE = $scope;
    this.DIALOG = $mdDialog;
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.data = data;
    $timeout(function () {
      var marker = null;
      var latlng = new google.maps.LatLng(parseInt(data.record.SubEntities[0].bhoomiDetails.latLang.split(',')[0]), parseInt(data.record.SubEntities[0].bhoomiDetails.latLang.split(',')[1]))

      var options = {
        center: latlng,
        zoom: 9,
        zoomControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT,
          style: google.maps.ZoomControlStyle.LARGE
        },
        panControl: false,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: "poi.business",
            elementType: "labels",
            stylers: [
              {visibility: "off"}
            ]
          }
        ],
        disableDefaultUI: false
      };

      var map = new google.maps.Map(document.querySelectorAll('div.dialog-map')[0], options);
      marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: 'property number - ' + data.record.EntId
      });
    });




    $scope.onDone= this.onDone.bind(this);





  }

  onDone() {
    this.DIALOG.hide();
  }


}




MapDialogController.$inject = ['$scope', '$mdDialog','data', '$timeout']
