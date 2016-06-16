angular.module('app')
.factory('ajaxFactory', ($http) => {

  return {
    getAppTitle : () => {
      return $http.get('/api/getData/title')
              .then((result) => {
                return result.data;
              });
    }
  };
});
