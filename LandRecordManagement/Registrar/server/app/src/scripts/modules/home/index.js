import angular from 'angular';
import uirouter from 'angular-ui-router';

import HomeController from './controller/home';
import BCService from './services/homeBCService';
import OTLoginCOntroller from './controller/OTLoginController';
import PTLoginCOntroller from './controller/propertyTransfer';


export default angular.module('home', [uirouter])
  .factory('bcSrvc', ['$http', '$q', ($http, $q) => new BCService($http, $q)])
  .controller('HomeController', HomeController)
  .controller('DController', OTLoginCOntroller)
  .controller('PTController', PTLoginCOntroller)
  .name;
