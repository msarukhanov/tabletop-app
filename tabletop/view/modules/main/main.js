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
                userRequests.CRUDUser('accountInfo', {}, function (data) {
                    $scope.error = data.error;
                    $scope.message = data.message;
                    if (!data.error) {
                        var token = data.data.user_token;
                        $cookieStore.put('token', token);
                        $rootScope.userInfo = data;
                        $rootScope.isLoggedIn = true;
                    }
                    else {
                        $scope.showToastError($scope.message);
                    }
                });
            }
            $rootScope.isLoggedIn = false;
        }
        getUserInfo(token);
    }
]);