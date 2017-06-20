angular
    .module('DroneApp')
    .factory('MenuService', function($http) {

            return {

                getMenu: function() {
                    return $http({
                        method: 'GET',
                        url: '/menu'
                    });
                }

            }

        }

    );
