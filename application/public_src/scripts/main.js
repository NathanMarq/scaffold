angular.module('app', ['ngRoute'])
    .config(function($compileProvider, $routeProvider) {

      $compileProvider.debugInfoEnabled(false);

      $routeProvider
          .when('/', {
              templateUrl: 'views/pages/homepage.html',
              controller: 'HomepageCtrl'
          })
          .otherwise({
              redirectTo: '/'
          });
});
