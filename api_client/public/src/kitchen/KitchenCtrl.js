'use strict';

droneApp.controller('KitchenCtrl', function($scope, socket) {
    $scope.newOrders = [];
    $scope.gettingReadyOrders = [];

    socket.emit('enter kitchen');
    socket.on('get new orders', function (orders) {
        $scope.newOrders = [];
        for (let i = 0; i < orders.length; i++) {
            $scope.newOrders.push(orders[i]);
        }
    });
    socket.on('get cooking orders', function (orders) {
        $scope.gettingReadyOrders = [];
        for (let i = 0; i < orders.length; i++) {
            $scope.gettingReadyOrders.push(orders[i]);
        }
    });

    socket.on('to kitchen', function (newOrder) {
        $scope.newOrders.push({
            title: newOrder.title,
            client: newOrder.email,
            _id: newOrder._id
        });
    });
    
    $scope.startCook = function (id) {
        socket.emit('start cook', id);
    }

});