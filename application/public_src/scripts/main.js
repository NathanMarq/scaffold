angular.module('app', [ 'ngRoute' ])
.config(($compileProvider, $routeProvider) => {

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
