angular.module('app')
.controller('HomepageCtrl', ($scope, ajaxFactory) => {

  $scope.headerSize = null;
  $scope.subTitleSize = null;
  $scope.titleBGColor = '#555';

  $scope.colorOptions = [ '#002635', '#013440', '#AB1A25', '#D97925' ];

  ajaxFactory.getAppTitle().then((results) => {
    $scope.mainTitle = results;
  });

  $scope.changeColor = (color) => {
    $scope.titleBGColor = color;
  };

});
