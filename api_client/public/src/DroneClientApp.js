var droneApp = angular.module('DroneApp', ['ngRoute']);

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
            otherwise({
                redirectTo: '/'
            });
        }
    ]);
