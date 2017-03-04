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