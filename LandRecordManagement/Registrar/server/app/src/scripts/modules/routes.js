"use strict"

export default ($urlRouterProvider, $locationProvider, $stateProvider) => {
  $locationProvider.html5Mode(false);

  $stateProvider

    .state('home', {
      url: '/home/:user',
      template: require('./home/view/home.html'),
      controller: 'HomeController',
      controllerAs: 'home',
      authenticate: true
    })

    .state('login', {
      url: '/login',
      template: require('./login/view/login.html'),
      controller: 'LoginController',
      controllerAs: 'login',
       authenticate: false
    })

    .state('deed', {
      url: '/deed',
      template: require('./home/view/deed.html'),
      controller: 'DController',
      controllerAs: 'dc',
      authenticate: false
    })

    .state('transfer', {
      url: '/transfer/:pid',
      template: require('./home/view/propertyTransfer.html'),
      controller: 'PTController',
      controllerAs: 'pt',
      authenticate: false
    })

    $urlRouterProvider.otherwise("/login");
}
