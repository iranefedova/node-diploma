'use strict';

droneApp.controller('ClientLoginCtrl', function($scope, ClientService) {
    $scope.user = {};

    $scope.createUser = function(newUser) {

        ClientService.createUser(newUser).then(function(response) {

            $scope.newPokemonId = response.data;

        });

    }
});
