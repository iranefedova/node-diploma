'use strict';

droneApp.controller('ClientAccountCtrl', function($scope) {
  $scope.isOrder = false;

  $scope.showOrder = function() {
      $scope.isOrder = true;
  };

  $scope.backToList = function() {
      $scope.isOrder = false;
  };

  $scope.upToBalance = function() {

  };

});

droneApp.controller('ClientOrderCtrl', function($scope, MenuService) {
  $scope.menu = {};

  MenuService.getMenu().then(function(response) {
      $scope.menu = response.data;
  });

});
