'use strict';

droneApp.controller('ClientLoginCtrl', function($scope, ClientService, socket) {
    $scope.user = {};

    $scope.createUser = function(newUser) {
        socket.emit('new user', newUser.email);

        // ClientService.createUser(newUser).then(function(response) {
        //
        //     $scope.newPokemonId = response.data;
        //
        // });

    }
});