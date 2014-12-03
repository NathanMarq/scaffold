angular.module('wwwApp', ['ngRoute', 'ngMock'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/pages/homepage.html',
                controller: 'HomepageCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
});
