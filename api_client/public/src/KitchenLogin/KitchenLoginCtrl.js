'use strict';

droneApp.controller('KitchenLoginCtrl', function($scope, socket) {
    $scope.user = {};

    $scope.createCook = function(user) {
        socket.emit('new cook', user.id);
    }
});
