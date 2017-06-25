'use strict';

droneApp.controller('ClientAccountCtrl', function($scope, ClientService, $routeParams, socket) {
    $scope.isOrder = false;
    $scope.currentUser = {};

    socket.on('user login', function (useremail, username, userbalance) {
        $scope.currentUser.name = username;
        $scope.currentUser.balance = userbalance;
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
