'use strict';

droneApp.controller('ClientAccountCtrl', function($scope, socket) {
    $scope.isOrder = false;
    $scope.currentUser = {};
    $scope.userOrders = [];

    socket.on('user login', function (useremail, username, userbalance) {
        $scope.currentUser.name = username;
        $scope.currentUser.balance = userbalance;
        // $scope.currentUser.email = useremail;
        socket.emit('get orders');
    });

    socket.on('user orders', function (orders) {
        alert(orders);
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
        socket.emit('add order', foodTitle);
        socket.emit('down balance', foodPrice);
        $scope.userOrders.push({
            title: foodTitle,
            image: foodImg,
            status: 'Заказано'
        });
    }

});
