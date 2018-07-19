import angular from 'angular';
import uirouter from 'angular-ui-router';

import HomeController from './controller/home';
import InfoDialogController from './controller/infoDialog';
import SearchpanelService from './services/searchpanelService';
import SearchPanelMap from './directives/searchMap.js';
import MapDialogController from './controller/mapDialog';


export default angular.module('home', [uirouter])
  .factory('searchsrvc', ['$http', '$q', ($http, $q) => new SearchpanelService($http, $q)])
  .controller('HomeController', HomeController)
  .controller('InfoCtrl', InfoDialogController)
  .controller('MapCtrl', MapDialogController)
  .directive('searchMap', [SearchPanelMap.mapFactory])
  .name;
