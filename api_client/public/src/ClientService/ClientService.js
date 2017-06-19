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
                }

            }

        }

    );
