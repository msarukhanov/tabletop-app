var app = angular.module("tabletapApp", ['ngRoute', 'pascalprecht.translate', 'ngCookies','ngStorage', 'ngSanitize']);

app.config(['$routeProvider', '$translateProvider', '$httpProvider', '$locationProvider',
    function ($routeProvider, $translateProvider, $httpProvider, $locationProvider) {

        $translateProvider.useStaticFilesLoader({
            'prefix': 'files/locales/locale-',
            'suffix': '.json'
        });

        $routeProvider
            .when("/", {
                template : templates["../tabletop/view/modules/home/home.html"],
                controller: 'Home'
            })
            .when("/games", {
                template : templates["../tabletop/view/modules/home/home.html"],
                controller: 'Home'
            })
            .when("/charlist", {
                template : templates["../tabletop/view/modules/charlist/charlist.html"],
                controller: 'Home'
            })
            .when("/bio", {
                template : templates["../tabletop/view/modules/bio/bio.html"],
                controller: 'Home'
            })
            .when("/games", {
                template : templates["../tabletop/view/modules/home/home.html"],
                controller: 'Home'
            })

            .otherwise({
                redirectTo: '/'
            });
         //
         //$locationProvider.html5Mode({
         //    enabled: true,
         //    requireBase: false
         //});

        $httpProvider.interceptors.push(['$q', '$location', '$cookieStore', function($q, $location, $cookieStore, $rootScope) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    var token = $cookieStore.get('token');
                    if (token) {
                        config.headers.Authorization = token;
                    }
                    return config;
                },
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        $rootScope.isLoggedIn = false;
                        $cookieStore.remove('token');
                    }
                    return $q.reject(response);
                }
            };
        }]);
    }
]);

app.run(['$rootScope', '$translate', '$cookieStore', '$templateCache',
    function($rootScope, $translate, $cookieStore, $templateCache) {

        $rootScope.templates = templates;

        $templateCache.put('login', templates["../tabletop/view/modules/login/login.html"]);
        $templateCache.put('main', templates["../tabletop/view/modules/main/main.html"]);

        $rootScope.$on("$routeChangeStart", function () {
            if(!$cookieStore.get('token')){
                $rootScope.isLoggedIn = false;
            }
        });
        var token = $cookieStore.get('token');
        //$translate.use(locale);

    }
]);
app.factory('userRequests', ['$http', '$cookieStore', '$filter', function ($http, $cookieStore, $filter) {
    return {

        CRUDUser: function (path, obj, callback) {
            $http({
                method: 'POST',
                url: '/api/' + path,
                data: obj
            }).then(function (success) {
                callback(success.data)
            }, function (error) {
                callback(error.data)
            });
        }
    }
}]);