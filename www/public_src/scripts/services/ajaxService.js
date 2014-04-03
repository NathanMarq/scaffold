angular.module('wwwApp')
    .service('ajaxService', function($http) {

            return {
                getAppTitle : function() {
                    return $http.get('/api/getData/title')
                                .then(function(result){
                                    return result.data;
                                });
                },
                getAppContent : function() {
                    return $http.get('/api/getData/content')
                                .then(function(result){
                                    return result.data;
                                });
                }
            };
    });