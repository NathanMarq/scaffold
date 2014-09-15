angular.module('wwwApp')
    .service('ajaxService', function($http) {

            return {
                getAppTitle : function() {
                    return $http.get('/api/getData/title')
                                .then(function(result){
                                    return result.data;
                                });
                }
            };
    });
