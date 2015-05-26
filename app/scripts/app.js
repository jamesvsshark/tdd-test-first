'use strict';

/**
 * @ngdoc overview
 * @name tddTestFirstApp
 * @description
 * # tddTestFirstApp
 *
 * Main module of the application.
 */
angular
  .module('tddTestFirstApp', [
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
