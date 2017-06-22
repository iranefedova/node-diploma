'use strict';

droneApp.controller('ClientAccountCtrl', function($scope, ClientService, $routeParams) {
    $scope.isOrder = false;
    $scope.currentUser = {};

    $scope.$on("$routeChangeSuccess", function () {
        let email = $routeParams["email"];

        ClientService.getUser(email).then(function(response) {

            $scope.currentUser = response.data[0];

        });
    });

  $scope.showOrder = function() {
      $scope.isOrder = true;
  };

  $scope.backToList = function() {
      $scope.isOrder = false;
  };

  $scope.upToBalance = function() {
        ClientService.upToBalance($scope.currentUser.email).then(function (response) {
            $scope.currentUser.balance = response.data;
        });
  };

});

droneApp.controller('ClientOrderCtrl', function($scope, MenuService) {
  $scope.menu = {};

  MenuService.getMenu().then(function(response) {
      $scope.menu = response.data;
  });

});
