/* define our modules */
angular.module('uploadr.services', ['ngCookies']);
angular.module('uploadr.filters', []);
angular.module('uploadr.directives', ['monospaced.elastic']);
angular.module('uploadr.controllers', []);

/* load services */

/* load filters */

/* load directives */

/* load controllers */
require('./js/controllers/home.js');

window.Uploadr = angular.module("Uploadr", [
  'ui.router',
  'uploadr.controllers',
  'uploadr.directives',
  'uploadr.filters',
  'uploadr.services'
]);

Uploadr.run(['$rootScope', '$state',
  function($rootScope, $state) {
    $rootScope._ = window._;
    $rootScope.moment = window.moment;
  }
]);

/* application routes */
Uploadr.config(['$stateProvider','$locationProvider',
 function($stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('default', {
      url: '/',
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl'
    });
}]);
