(function () {
    'use strict';

    angular.module('smartinvestplusApp')
           .factory('Account', Account);

    Account.$inject = ['$resource'];

    function Account($resource, API_BASE_URL) {
        var service = $resource('api/accounts/:login', {}, {
            'get': {
                method: 'GET',
                params: {},
                isArray: false,
                interceptor: {
                    response: function (response) {
                        // expose response
                        return response;
                    }
                }
            }
        });

        return service;
    }
})();
