"use strict"

export default ($urlRouterProvider, $locationProvider, $stateProvider) => {
  $locationProvider.html5Mode(false);
  $urlRouterProvider.otherwise('/');

  $stateProvider

    .state('home', {
      url: '/',
      template: require('./home/view/home.html'),
      controller: 'HomeController',
      controllerAs: 'home'
    })

    .state('login', {

    });
}
