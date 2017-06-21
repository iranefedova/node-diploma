angular
    .module('DroneApp')
    .factory('OrderService', function($http) {

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
