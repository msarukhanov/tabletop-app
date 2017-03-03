app.controller('MainCtrl', ['userRequests', '$rootScope', '$scope', '$cookieStore', '$localStorage', '$location', '$translate',
    function (userRequests, $rootScope, $scope, $cookieStore, $localStorage, $location, $translate) {

        $rootScope.isLoggedIn = false;
        $rootScope.readOnly = false;
        $rootScope.showLM = false;
        $scope.menuLink = function (link) {
            $location.url(link);
            $rootScope.showLM = false;
        };
        $rootScope.toggleLeftMenu = function() {
            $rootScope.showLM = !$rootScope.showLM;
        };
        $scope.logout = function () {
            $cookieStore.remove('token');
            $rootScope.isLoggedIn = false;
            location.reload();
        };

        var token = $cookieStore.get('token');
        function getUserInfo(token) {
            if (token) {
                userRequests.getUserInfo(function (data) {
                    if (data && !data.error) {
                        $rootScope.isLoggedIn = true;
                        $rootScope.isTerminalUser = true;
                        $translate.use(locale);
                        $rootScope.userInfo = data;
                    }
                });

            }
            else {

            }
        }
        getUserInfo(token);
    }
]);