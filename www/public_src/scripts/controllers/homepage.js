angular.module('wwwApp')
    .controller('HomepageCtrl', function($scope, ajaxService) {

        ajaxService.getAppTitle().then(function(results){
            $scope.mainTitle = results;
        });
        ajaxService.getAppContent().then(function(results){
            $scope.content = results;
        });

    });