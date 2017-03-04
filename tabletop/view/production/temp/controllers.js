app.controller('Home', ['$scope', '$rootScope', '$routeParams',
    function ($scope, $rootScope, $routeParams) {


    }
]);
app.controller('Login', ['$scope', '$rootScope', '$routeParams', '$cookieStore', 'userRequests', '$localStorage', '$translate',
    function ($scope, $rootScope, $routeParams, $cookieStore, userRequests, $localStorage, $translate) {

        window.deleteCookie = function() {
            $cookieStore.remove('token');
        };

        $scope.showToastError = function (errorMsg) {
            if(errorMsg == 'Already logged in.') errorMsg = '<span onclick="deleteCookie()">' + errorMsg + '</span>';
            Materialize.toast(errorMsg, 3000, 'teal darken-3 rounded');
        };

        $scope.userLogin = function () {
            if ($scope.login) {
                var formData = $scope.login;
                userRequests.CRUDUser('signIn', formData, function (data) {
                    $scope.error = data.error;
                    $scope.message = data.message;
                    if (!data.error) {
                        var token = data.data.user_token;
                        $cookieStore.put('token', token);
                        $rootScope.getUserData();
                    } else {
                        $scope.showToastError($scope.message);
                    }
                });
            } else {
                $scope.message = 'Fields are required!';
            }
        };

        $rootScope.getUserData = function () {
            var token = $cookieStore.get('token');
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
        };

    }
]);
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