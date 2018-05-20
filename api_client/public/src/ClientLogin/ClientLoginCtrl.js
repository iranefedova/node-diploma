'use strict';

droneApp.controller('ClientLoginCtrl', function($scope, socket) {
    $scope.user = {};

    $scope.createUser = function(newUser) {
        socket.emit('new user', newUser.name, newUser.email);
    }
});
