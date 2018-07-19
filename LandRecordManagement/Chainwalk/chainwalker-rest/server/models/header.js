export default class HeaderController {
  constructor($scope, authenticationSrvc, $location, $timeout) {
    var header = this;
    this.AUTHSRVC = authenticationSrvc;
    this.LOC = $location;


    $timeout(() => {
      if(header.LOC.path() === '/login') {
        header.showLink = false;
      } else if(header.LOC.path() === '/') {
        header.showLink = true;
      } else if(header.LOC.path().includes('/registeruser') || header.LOC.path().includes('/addrov')) {
        header.showLink = true;
      }
    },0, false);


    $scope.$on('$locationChangeStart', (evt, args) => {
      $timeout(() => {
        if(header.LOC.path() === '/login') {
          header.showLink = false;
        } else if(header.LOC.path() === '/') {
          header.showLink = true;
        } else if(header.LOC.path().includes('/registeruser') || header.LOC.path().includes('/addrov')) {
          header.showLink = true;
        }
      },0, false);
    });
  }

  logout() {
    var header = this;
    header.AUTHSRVC.logout().then((result) => {
      header.LOC.path("/login");
      header.showLink = false;
    }, (err) => {
      //header.error = err.data.error.message;
    })
  }
}

HeaderController.$inject = ['$scope', 'authenticationSrvc', '$location', '$timeout']
