angular
    .module('DroneApp')
    .factory('ClientService', function($http) {

            return {

                getUserOrder: function(userEmail) {
                    return $http({
                        method: 'GET',
                        url: '/order/' + userEmail
                    });
                }

            }

        }

    );
