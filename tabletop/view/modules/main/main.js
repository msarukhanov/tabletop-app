app.controller('MainCtrl', ['userRequests', '$rootScope', '$scope', '$cookieStore', '$location', '$translate',
    function (userRequests, $rootScope, $scope, $cookieStore, $location, $translate) {

        $rootScope.isLoggedIn = false;
        $rootScope.readOnly = false;
        $rootScope.showLM = false;
        $rootScope.hideLoader = true;
        $scope.menuLink = function (link) {
            $location.url(link);
            $rootScope.showLM = false;
        };
        $rootScope.toggleLeftMenu = function(param) {
            $rootScope.showLM = param!=undefined ? param : !$rootScope.showLM;
        };
        $scope.logout = function () {
            $cookieStore.remove('ttapp_token');
            $rootScope.isLoggedIn = false;
            $location.url("/");
        };

        $rootScope.getUserData = function () {
            $rootScope.hideLoader = false;
            var token = $cookieStore.get('ttapp_token');
            if (token) {
                userRequests.CRUDUser('accountInfo', {}, function (data) {
                    $scope.error = data.error;
                    $scope.message = data.message;
                    $rootScope.hideLoader = true;
                    if (!data.error) {
                        var token = data.data.user_token;
                        $cookieStore.put('ttapp_token', token);
                        $rootScope.userInfo = data.data;
                        $rootScope.mainLocale = "locales/locale-" + $rootScope.userInfo.lang;
                        $translate.use("locales/locale-" + $rootScope.userInfo.lang);
                        $rootScope.isLoggedIn = true;
                    }
                    else {
                        //if($scope && $scope.showToastError) $scope.showToastError($scope.message);
                    }
                });
            }
            else $rootScope.isLoggedIn = false;
        };
        $rootScope.getUserData();

    }
]);