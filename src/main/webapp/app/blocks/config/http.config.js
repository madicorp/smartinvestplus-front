(function () {
    'use strict';

    angular
        .module('smartinvestplusApp')
        .config(httpConfig);

    httpConfig.$inject = ['$urlRouterProvider', '$httpProvider', 'httpRequestInterceptorCacheBusterProvider',
                          '$urlMatcherFactoryProvider', '$provide', '$injector'];

    function httpConfig($urlRouterProvider, $httpProvider, httpRequestInterceptorCacheBusterProvider,
                        $urlMatcherFactoryProvider, $provide, $injector) {

        //Cache everything except rest api requests
        httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*api.*/, /.*protected.*/], true);

        $urlRouterProvider.otherwise('/');

        $httpProvider.interceptors.push('errorHandlerInterceptor');
        $httpProvider.interceptors.push('authExpiredInterceptor');
        $httpProvider.interceptors.push('notificationInterceptor');
        $httpProvider.defaults.withCredentials = true;
        // jhipster-needle-angularjs-add-interceptor JHipster will add new application http interceptor here

        $urlMatcherFactoryProvider.type('boolean', {
            name: 'boolean',
            decode: function (val) {
                return val === true || val === 'true';
            },
            encode: function (val) {
                return val ? 1 : 0;
            },
            equals: function (a, b) {
                return this.is(a) && a === b;
            },
            is: function (val) {
                return [true, false, 0, 1].indexOf(val) >= 0;
            },
            pattern: /bool|true|0|1/
        });

        try {
            var API_BASE_URL = $injector.get('API_BASE_URL');
            if (API_BASE_URL) {
                $provide.decorator('$resource', ['$delegate',
                                                 function $resourceDecorator($originalResource) {
                                                     var that = this;
                                                     return $resourceDecorated;
                                                     function $resourceDecorated() {
                                                         arguments[0] = API_BASE_URL + arguments[0];
                                                         return $originalResource.apply(that, arguments);
                                                     }
                                                 }]);

                $provide.decorator('$http', ['$delegate',
                                             function $httpDecorator($originalHttp) {
                                                 var that = $originalHttp;
                                                 var $httpDecorated = $originalHttp;
                                                 $httpDecorated.get = decoratedHttpMethod($originalHttp.get);
                                                 $httpDecorated.post = decoratedHttpMethod($originalHttp.post);
                                                 $httpDecorated.put = decoratedHttpMethod($originalHttp.put);
                                                 $httpDecorated.delete = decoratedHttpMethod($originalHttp.delete);
                                                 return $httpDecorated;

                                                 function decoratedHttpMethod(originalMethod) {
                                                     return function () {
                                                         if (arguments[0].indexOf('api/') !== -1) {
                                                             arguments[0] = API_BASE_URL + arguments[0];
                                                         }
                                                         return originalMethod.apply(that, arguments);
                                                     };
                                                 }
                                             }]);
            }
        } catch (e) {
            // ignore because it means api base url has been defined
        }
    }
})();
