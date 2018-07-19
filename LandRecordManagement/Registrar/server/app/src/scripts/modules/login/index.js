// export default function init() {
//   return {
//     init: (module) => {
//       console.log("constants initialised");
//     }
//   };
// };

import angular from 'angular';
import uirouter from 'angular-ui-router';
import LoginController from './controller/login';
import LoginService from './services/loginService';

export default angular.module('login', [uirouter])
  .factory('loginsrvc', ['$http', '$q', '$window', ($http, $q, $window) => new LoginService($http, $q, $window)])
  .controller('LoginController',LoginController)
  .name;
