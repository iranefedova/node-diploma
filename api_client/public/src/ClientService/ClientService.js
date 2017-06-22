angular
    .module('DroneApp')
    .factory('ClientService', function($http) {

            return {

                createUser: function(userData) {
                    return $http({
                        method: 'POST',
                        url: '/clients',
                        data: userData
                    });
                },
                getUser: function(userEmail) {
                    return $http({
                        method: 'GET',
                        url: '/clients/' + userEmail
                    });
                },
                upToBalance: function (userEmail) {
                    return $http({
                        method: 'GET',
                        url: '/clients/balance/' + userEmail
                    });
                }

            }

        }

    );
