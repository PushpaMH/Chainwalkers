
//import css
require('angular-material/angular-material.css');
import '../../styles/main.styl';


import angular from 'angular';
import uirouter from 'angular-ui-router';
import sanitize from 'angular-sanitize';
require('angular-aria/angular-aria.js');
require('angular-animate/angular-animate.js');
require('angular-material/angular-material.js');
import './lib/md-data-table';
import './lib/stateEvent';
import 'babel-polyfill';
import routes from './routes';
import home from './home';
import login from './login';

export default function app() {

  var ngApp = angular.module('BcPortal', [uirouter, 'ui.router.state.events', sanitize, 'ngMaterial', 'ngAria', 'md.data.table', login, home])

  .config(['$urlRouterProvider', '$locationProvider', '$stateProvider', routes]);
  //set theme for UI
  ngApp
  .config(["$sceProvider",($sceProvider) => {
    $sceProvider.enabled(false);
  }])
  .config(($mdThemingProvider) => {
    $mdThemingProvider.definePalette('lightPalette', {
        '50': 'f7fcf4',
        '100': 'eaf7e5',
        '200': 'dcf1d3',
        '300': 'ceebc1',
        '400': 'c4e7b4',
        '500': 'b9e3a7',
        '600': 'b2e09f',
        '700': 'aadc96',
        '800': 'a2d88c',
        '900': '93d07c',
        'A100': 'ffffff',
        'A200': 'ffffff',
        'A400': 'f3ffef',
        'A700': 'e1ffd5',
        'contrastDefaultColor': 'light',
        'contrastDarkColors': [
          '50',
          '100',
          '200',
          '300',
          '400',
          '500',
          '600',
          '700',
          '800',
          '900',
          'A100',
          'A200',
          'A400',
          'A700'
        ],
        'contrastLightColors': []
      });
      $mdThemingProvider.theme('default')
        .primaryPalette('lightPalette');
  });

  ngApp.run(['$rootScope', '$state', 'loginsrvc', function($rootScope, $state, loginsrvc) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
      if (toState.authenticate && !loginsrvc.isAuthenticated()){
        // User isn’t authenticated
        $state.transitionTo("login");
        event.preventDefault();
      }
    });
  }]);
  return ngApp;
}
