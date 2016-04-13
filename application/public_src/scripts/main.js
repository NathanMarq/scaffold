angular.module('app', ['ngRoute'])
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
