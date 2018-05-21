'use strict';

droneApp.controller('KitchenCtrl', function($scope, socket) {
    $scope.newOrders = [];
    $scope.gettingReadyOrders = [];
    $scope.currentCook = {};

    socket.emit('enter kitchen');

    socket.on('add cook', function (cook) {
        $scope.currentCook.id = cook.id;
    });

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
            food: newOrder.food,
            client: newOrder.email,
            _id: newOrder._id
        });
    });

    $scope.startCook = function (id) {
        socket.emit('start cook', id);
    }

    $scope.finishCook = function (id) {
        for (let i = 0; i < $scope.gettingReadyOrders.length; i++) {
            if ($scope.gettingReadyOrders[i]._id === id) {
                Materialize.toast($scope.gettingReadyOrders[i].food.title + ' передано на доставку', 2000);
                $scope.gettingReadyOrders.splice(i, 1);
                break;
            }
        };

        socket.emit('finish cook', id);
    }

    $scope.exit = function() {
      $scope.currentCook = {};
      socket.emit('disconnect');
      window.location = "#!/kitchen_enter";
    };

});
