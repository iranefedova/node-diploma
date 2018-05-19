var droneApp = angular.module('DroneApp', [
    'ngRoute',
    'btford.socket-io'
]);

angular
    .module('DroneApp')

    .config(['$routeProvider',
        function config($routeProvider) {

            $routeProvider.
            when('/', {
                templateUrl: 'src/ClientLogin/ClientLogin.html',
                controller: 'ClientLoginCtrl'
            }).
            when('/account', {
                templateUrl: 'src/ClientAccount/ClientAccount.html',
                controller: 'ClientAccountCtrl'
            }).
            when('/kitchen_enter', {
                templateUrl: 'src/KitchenLogin/KitchenLogin.html',
                controller: 'KitchenLoginCtrl'
            }).
            when('/kitchen', {
                templateUrl: 'src/kitchen/Kitchen.html',
                controller: 'KitchenCtrl'
            }).
            otherwise({
              templateUrl: 'src/404/404.html'
                // redirectTo: '/'
            });
        }
    ]);
