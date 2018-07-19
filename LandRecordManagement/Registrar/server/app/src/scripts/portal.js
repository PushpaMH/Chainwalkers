"use strict"

import angular from 'angular';
import app from "./modules/conf";

var ngApp = null;

window.name = "NG_DEFER_BOOTSTRAP!";
angular.element(document.getElementsByTagName('html')[0]);
angular.element().ready(() => {
  ngApp = app();
  angular.resumeBootstrap([ngApp.name]);
});
