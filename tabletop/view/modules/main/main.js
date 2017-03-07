app.controller('MainCtrl', ['userRequests', '$rootScope', '$scope', '$cookieStore', '$localStorage', '$location', '$translate',
    function (userRequests, $rootScope, $scope, $cookieStore, $localStorage, $location, $translate) {

        $rootScope.isLoggedIn = false;
        $rootScope.readOnly = false;
        $rootScope.showLM = false;
        $rootScope.hideLoader = true;
        $scope.menuLink = function (link) {
            $location.url(link);
            $rootScope.showLM = false;
        };
        $rootScope.toggleLeftMenu = function() {
            $rootScope.showLM = !$rootScope.showLM;
        };
        $scope.logout = function () {
            $cookieStore.remove('ttapp_token');
            $rootScope.isLoggedIn = false;
            location.reload();
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