'use strict';

droneApp.controller('ClientAccountCtrl', function($scope, socket) {
    $scope.isOrder = false;
    $scope.currentUser = {};
    $scope.userOrders = [];

    socket.on('user login', function (useremail, username, userbalance) {
        $scope.currentUser.name = username;
        $scope.currentUser.balance = userbalance;
        socket.emit('get orders');
    });

    socket.on('user orders', function (orders) {
        $scope.userOrders = [];
        for (let i = 0; i < orders.length; i++) {
            $scope.userOrders.push(orders[i]);
        }
    });

    $scope.showOrder = function() {
        $scope.isOrder = true;
    };

    $scope.backToList = function() {
        $scope.isOrder = false;
    };

    $scope.upToBalance = function() {
        socket.emit('up balance');
    };

    socket.on('balance change', function (userbalance) {
        $scope.currentUser.balance = userbalance;
    });

});

droneApp.controller('ClientOrderCtrl', function($scope, MenuService, socket) {
    $scope.menu = {};

    MenuService.getMenu().then(function(response) {
        $scope.menu = response.data;
    });
    
    $scope.addOrder = function (foodTitle, foodPrice, foodImg) {
        socket.emit('add order', foodTitle, foodImg, socket.id);
        socket.emit('down balance', foodPrice);
    };

    socket.on('new order', function (order) {
        $scope.userOrders.push({
            title: order.title,
            image: order.image,
            status: order.status,
            _id: order._id
        });
    });

    socket.on('status change', function (id, status) {
        for(let i = 0; i < $scope.userOrders.length; i++) {
            if ($scope.userOrders[i]._id === id) {
                $scope.userOrders[i].status = status;
                break;
            }
        }
    });

});
