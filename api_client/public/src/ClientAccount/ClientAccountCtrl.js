'use strict';

droneApp.controller('ClientAccountCtrl', function($scope, socket) {
    $scope.isOrder = false;
    $scope.currentUser = {};
    $scope.userOrders = [];

    socket.emit('load account');

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

    $scope.exit = function() {
      $scope.currentUser = {};
      socket.emit('disconnect');
      window.location = "/"
    };

    $scope.upToBalance = function() {
        socket.emit('up balance');
        Materialize.toast('На ваш счёт зачислено 100 единиц', 2000);
    };

    socket.on('balance change', function (userbalance) {
        $scope.currentUser.balance = userbalance;
    });

});

droneApp.controller('ClientOrderCtrl', function($scope, MenuService, socket) {
    $scope.menu = {};
    $scope.userTable = 0;

    MenuService.getMenu().then(function(response) {
        $scope.menu = response.data;
    });

    $scope.addOrder = function (food) {
      if ($scope.userTable <= 0) {
        Materialize.toast('Введите номер столика!', 2000);
        return;
      }
        socket.emit('add order', food, $scope.userTable);
        $scope.userOrders.push({
            food: food,
            status: 'Заказано'
        });
        socket.emit('down balance', food.price);
        Materialize.toast('Заказ успешно добавлен!', 2000);
    };

    socket.on('new order', function (orderID) {
        $scope.userOrders[$scope.userOrders.length - 1]._id = orderID;
    });

    socket.on('status change', function (id, status) {
        let number = 0;
        for(let i = 0; i < $scope.userOrders.length; i++) {
            if ($scope.userOrders[i]._id === id) {
                $scope.userOrders[i].status = status;
                number = i;
                break;
            }
        }
        if (status === 'Подано' || status === 'Возникли сложности') {
            setTimeout(() => {
                socket.emit('delete order', id);
            }, 30000);
        }

        if (status === 'Возникли сложности') {
            socket.emit('return money', id);
            Materialize.toast('С доставкой заказа возникли сложности. Стоимость возвращена на Ваш счёт', 2000);
        }
    });

    socket.on('order deleted', function (id) {
        for(let i = 0; i < $scope.userOrders.length; i++) {
            if ($scope.userOrders[i]._id === id) {
                $scope.userOrders.splice(i, 1);
                break;
            }
        }
    });

});
